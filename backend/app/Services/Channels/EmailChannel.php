<?php

namespace App\Services\Channels;

use Illuminate\Support\Facades\Log;

class EmailChannel
{
    public function send(array $payload): void
    {
        Log::info('Email Payload:', $payload);
    }
}