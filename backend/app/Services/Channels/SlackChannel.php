<?php
namespace App\Services\Channels;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SlackChannel
{
    public function send(array $payload): void
    {
        $webhookUrl = env('SLACK_WEBHOOK_URL'); 
        if (!$webhookUrl) {
            Log::warning('Slack webhook no definido');
            return;
        }

        try {
            Http::post($webhookUrl, $payload);
            Log::info('Slack Payload enviado:', $payload);
        } catch (\Exception $e) {
            Log::error('Error Slack: ' . $e->getMessage());
        }
    }
}