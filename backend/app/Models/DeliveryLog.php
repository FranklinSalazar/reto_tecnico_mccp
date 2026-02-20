<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryLog extends Model
{
    protected $fillable = [
        'message_id',
        'channel',
        'status',
        'error_message',
        'payload'
    ];

    public function message()
    {
        return $this->belongsTo(Message::class);
    }
}
