local moduleName = ""
local M = {}
_G[moduleName] = M

--table module
local table = table
--bit module
local bit = bit
--timer module
local tmr = tmr
--gpio module
local gpio = gpio
-- local environoment
setfenv(1, M)

local function set_sck(v)
    if (v == 1) then
        gpio.write(sck, gpio.HIGH)
    else
        gpio.write(sck, gpio.LOW)
    end
end

local function set_data(v)
    if (v == 1) then
        gpio.mode(data, gpio.INPUT)
    else
        gpio.write(data, gpio.LOW)
        gpio.mode(data, gpio.OUTPUT)
    end
end

local function start()
    set_data(1)
    set_sck(0)
    tmr.delay(1)
    set_sck(1)
    tmr.delay(1)
    set_data(0)
    tmr.delay(1)
    set_sck(0)
    tmr.delay(1)
    set_sck(1)
    tmr.delay(1)
    set_data(1)
    tmr.delay(1)
    set_sck(0)
end

local function reset()
    set_data(1)
    set_sck(0)
    for i = 0, 8 do
        set_sck(1)
        tmr.delay(1)
        set_sck(0)
        tmr.delay(1)
    end
    start()
end

local function write(v)
    local c = v
    local ret
    for i = 0, 7 do
        if (bit.band(c, 0x80) ~= 0) then
            set_data(1)
        else
            set_data(0)
        end
        c = bit.lshift(c, 1)
        set_sck(1)
        tmr.delay(1)
        set_sck(0)
        tmr.delay(1)
    end
    set_data(1)
    set_sck(1)
    tmr.delay(1)
    ret = gpio.read(data)
    set_sck(0)
    return ret
end

local function read(ack)
    local c = 0
    set_data(1)
    for i = 0, 7 do
        c = bit.lshift(c, 1)
        set_sck(1)
        tmr.delay(1)
        c = bit.bor(c, gpio.read(data))
        set_sck(0)
        tmr.delay(1)
    end
    if (ack == 1) then
        set_data(0)
    end
    set_sck(1)
    tmr.delay(1)
    set_sck(0)
    set_data(1)
    return c
end

function M.init(s, d)
    sck = s
    data = d
    gpio.mode(data, gpio.INPUT);
    gpio.mode(sck, gpio.OUTPUT);

end

function M.read_measurements()

    reset()
    start()
    --TODO: add ACK check
    write(0x03)

    set_data(1)

    --TODO: add timeout
    for i = 0, 65536 do
        if (gpio.read(data) == 0) then
            break
        end
    end

    t0 = read(1)
    t1 = read(1)
    --TODO: add crc checking
    t_crc = read(0)
    t = bit.lshift(t0, 8);
    t = bit.bor(t, t1)
    --t = t - 4010 --for 5V
    t = t - 3970 --for 3.5V

    start()
    write(0x05)
    set_data(1)

    --TODO: add timeout
    for i = 0, 65536 do
        if (gpio.read(data) == 0) then
            break
        end
    end

    h0 = read(1)
    h1 = read(1)
    --TODO: add crc checking
    h_crc = read(0)

    h = bit.lshift(h0, 8);
    h = bit.bor(h, h1)

    --compensation magic part 1
    rh = 268 * h
    rh = rh / 256
    rh = -rh
    rh = rh + 24052
    rh = rh * h
    rh = rh - 1341391
    rh = rh / 65536

    --compensation magic part 2
    rh_true = 52 * h
    rh_true = 6554 + rh_true
    rh_true = rh_true * (t - 2500) / 100
    rh_true = rh_true / 65536
    rh_true = rh_true + rh

    return t, rh_true
end

return M
