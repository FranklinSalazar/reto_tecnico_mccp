<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'title',
        'original_content',
        'summary',
        'status'
    ];
    
    public function deliveryLogs()
    {
        return $this->hasMany(DeliveryLog::class);
    }
}
