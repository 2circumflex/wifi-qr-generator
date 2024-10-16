'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wifi } from 'lucide-react'

export function WifiQrCodeGenerator() {
  const [brandName, setBrandName] = useState('')
  const [networkName, setNetworkName] = useState('')
  const [password, setPassword] = useState('')
  const [encryptionType, setEncryptionType] = useState('WPA')
  const [backgroundColor, setBackgroundColor] = useState('#000000')

  const generateWifiString = () => {
    if (!networkName || !password) return '';
    return `WIFI:T:${encryptionType};S:${networkName};P:${password};;`
  }

  const wifiString = generateWifiString()

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">WIFI QRCODE</h2>
      <div className="space-y-8">
        <div className="p-4 rounded-lg w-64 mx-auto" style={{ backgroundColor }}>
          <div className="text-center mb-2 text-white text-lg font-bold">WIFI 접속</div>
          <div className="w-48 h-48 mx-auto bg-white flex items-center justify-center">
            {wifiString ? (
              <QRCodeSVG
                value={wifiString}
                size={192}
                bgColor="#ffffff"
                fgColor="#000000"
                level="L"
                includeMargin={false}
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                <Wifi className="w-12 h-12 mb-2" />
                <p className="text-sm text-center">
                  QR 코드를 생성하려면<br />네트워크 정보를 입력하세요
                </p>
              </div>
            )}
          </div>
          <div className="text-center mt-2 text-white text-lg font-bold">{brandName}</div>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="brandName">브랜드 이름</Label>
            <Input
              id="brandName"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="networkName">네트워크 이름(SSID)</Label>
            <Input
              id="networkName"
              value={networkName}
              onChange={(e) => setNetworkName(e.target.value)}
              placeholder="네트워크 이름 입력"
            />
          </div>
          <div>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
            />
          </div>
          <div>
            <Label htmlFor="encryptionType">암호화 유형</Label>
            <Select value={encryptionType} onValueChange={setEncryptionType}>
              <SelectTrigger id="encryptionType">
                <SelectValue placeholder="암호화 유형 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WPA">WPA/WPA2</SelectItem>
                <SelectItem value="WEP">WEP</SelectItem>
                <SelectItem value="nopass">암호 없음</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="backgroundColor">컨테이너 배경색</Label>
            <Input
              id="backgroundColor"
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-8 h-8 p-0 border-0"
            />
          </div>
        </div>
        <Button className="w-full">생성하기</Button>
      </div>
    </div>
  )
}
