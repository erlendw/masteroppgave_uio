function sendData()
    sht = require("sht11")
    --clock on GPIO4, data on GPIO12
    sht.init(3, 4)

    t, h = sht.read_measurements()
    print(wifi.sta.getip())

    chipId = node.chipid()
    soilMoisture = h/10
    soilTemperature = t/100

    --dataString = string.format('{"chipcode":"%f","soilMoisture":"%f", "soilTemperature":"%f"}', chipId, soilMoisture, soilTemperature)
    dataString = "{\"chipcode\": \"".. tostring(chipcode) .."\", \"soilMoisture\": \"" .. tostring(soilMoisture) .. "\", \"soilTemperature\": \"" .. tostring(soilTemperature) .. "\"}"
    --print(soilMoisture)
    --print(soilTemperature)

    http.post('http://192.81.221.165:80/api/datapoint',
          'Content-Type: application/json\r\n',
            dataString,
          function(code, data)
            if (code < 0) then
              --print("HTTP request failed")
              node.dsleep(1 * 60 * 1000000)--sleep 1 minute and retry
            else
              print(code, data)
              node.dsleep(30 * 60 * 1000000)--sleep 30 minutes
            end
          end)

    
end

sendData()