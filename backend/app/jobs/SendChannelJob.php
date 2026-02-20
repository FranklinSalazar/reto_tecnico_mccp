<?php

namespace App\Jobs;

use App\Models\Message;
use App\Models\DeliveryLog;
use App\Services\Channels\EmailChannel;
use App\Services\Channels\SlackChannel;
use App\Services\Channels\SmsSoapChannel;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendChannelJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Message $message,
        public string $channel
    ) {}

    public function handle(): void
    {
        $payload = [
            'title' => $this->message->title,
            'summary' => $this->message->summary,
            'original_content' => $this->message->original_content,
        ];

        try {

            $service = match($this->channel) {
                'email' => app(EmailChannel::class),
                'slack' => app(SlackChannel::class),
                'sms'   => app(SmsSoapChannel::class),
            };

            if ($this->channel === 'sms') {
                unset($payload['original_content']);
            }

            $service->send($payload);

            DeliveryLog::create([
                'message_id' => $this->message->id,
                'channel' => $this->channel,
                'status' => 'enviado',
                'payload' => json_encode($payload),
            ]);

        } catch (\Exception $e) {

            DeliveryLog::create([
                'message_id' => $this->message->id,
                'channel' => $this->channel,
                'status' => 'fallido',
                'error_message' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}
