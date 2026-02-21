<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\DeliveryLog;
use App\Services\Channels\EmailChannel;
use App\Jobs\ProcessMessageJob;
use App\Services\AIService;

class MessageController extends Controller
{

    public function index()
    {
        return Message::with('deliveryLogs')->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'original_content' => 'required|string',
            'channels' => 'required|array',
            'channels.*' => 'in:email,slack,sms'
        ]);

        $message = Message::create([
            'title' => $validated['title'],
            'original_content' => $validated['original_content'],
            'status' => 'pendiente',
        ]);

        ProcessMessageJob::dispatch(
            $message,
            $validated['channels']
        );

        return response()->json([
            'message' => 'Mensaje en procesamiento',
            'data' => $message
        ]);
    }

}