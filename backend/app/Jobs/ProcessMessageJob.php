<?php

namespace App\Jobs;

use App\Models\Message;
use App\Models\DeliveryLog;
use App\Services\Channels\EmailChannel;
use App\Services\Channels\SlackChannel;
use App\Services\Channels\SmsSoapChannel;
use App\Services\AIService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Log;

class ProcessMessageJob implements ShouldQueue
{
    use Dispatchable, Queueable;

    public function __construct(
        public Message $message,
        public array $channels
    ) {}

    public function handle(AIService $aiService): void
    {
        Log::error('ProcessMessageJob iniciado para message id '.$this->message->id);

        try {
            
            $summary = $aiService->generateSummary($this->message->original_content);
            $this->message->update([
                'summary' => $summary,
                'status' => 'procesado'
            ]);

            Log::info('Resumen generado: '.$summary);

        } catch (\Exception $e) {
            Log::error('Error IA en message id '.$this->message->id.': '.$e->getMessage());
            $this->message->update(['status' => 'fallido']);
            return;
        }

        $channelMap = [
            'email' => EmailChannel::class,
            'slack' => SlackChannel::class,
            'sms' => SmsSoapChannel::class,
        ];

        foreach ($this->channels as $channel) {
            try {

                if (!isset($channelMap[$channel])) continue;

                $payloadToSend = [
                    'title' => $this->message->title,
                    'summary' => $this->message->summary,
                    'original_content' => $this->message->original_content,
                ];

                if ($channel === 'sms') {
                    unset($payloadToSend['original_content']);
                }

                app($channelMap[$channel])->send($payloadToSend);

                DeliveryLog::create([
                    'message_id' => $this->message->id,
                    'channel' => $channel,
                    'status' => 'exito',
                    'payload' => json_encode($payloadToSend)
                ]);

                Log::info("Canal $channel enviado correctamente para message id ".$this->message->id);

            } catch (\Exception $e) {
                DeliveryLog::create([
                    'message_id' => $this->message->id,
                    'channel' => $channel,
                    'status' => 'fallido',
                    'error_message' => $e->getMessage()
                ]);

                Log::error("Error en canal $channel para message id ".$this->message->id.": ".$e->getMessage());
            }
        }
    }
}