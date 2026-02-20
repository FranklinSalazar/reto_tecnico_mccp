<?php
namespace App\Services\Channels;

use Illuminate\Support\Facades\Log;

class SmsSoapChannel
{
    public function send(array $payload): bool
    {
        $xml = "
        <soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:sms='http://ultracem.com/sms'>
           <soapenv:Header/>
           <soapenv:Body>
              <sms:SendSmsRequest>
                 <sms:destination>+570000000000</sms:destination>
                 <sms:message>{$payload['summary']}</sms:message>
                 <sms:reference>{$payload['title']}</sms:reference>
              </sms:SendSmsRequest>
           </soapenv:Body>
        </soapenv:Envelope>";

        Log::info('SMS SOAP XML:', ['xml' => $xml]);

        return true;
    }
}

?>