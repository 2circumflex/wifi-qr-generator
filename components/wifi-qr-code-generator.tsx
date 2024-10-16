'use client'

import { useState, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wifi } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import html2canvas from 'html2canvas'

const formSchema = z.object({
  brandName: z.string().min(1, "브랜드 이름은 필수입니다."),
  networkName: z.string().min(1, "네트워크 이름은 필수입니다."),
  password: z.string().min(1, "비밀번호는 필수입니다."),
  encryptionType: z.enum(["WPA", "WEP", "nopass"]),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "유효한 색상 코드를 입력하세요."),
})

export function WifiQrCodeGenerator() {
  const [wifiString, setWifiString] = useState('')
  const cardRef = useRef<HTMLDivElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandName: "",
      networkName: "",
      password: "",
      encryptionType: "WPA",
      backgroundColor: "#000000",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { brandName, networkName, password, encryptionType } = values
    console.log(brandName);
    setWifiString(`WIFI:T:${encryptionType};S:${networkName};P:${password};;`)
  }

  function handleDownload() {
    if (cardRef.current) {
      html2canvas(cardRef.current).then((canvas) => {
        const link = document.createElement('a')
        link.download = 'wifi-qr-code.png'
        link.href = canvas.toDataURL()
        link.click()
      })
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">WIFI QRCODE</h2>
      <div className="space-y-8">
        <div ref={cardRef} className="p-4 rounded-lg w-64 mx-auto relative" style={{ backgroundColor: form.watch("backgroundColor") }}>
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
          <div className="text-center mt-2 text-white text-lg font-bold h-7">
            {form.watch("brandName") || "\u00A0"}
          </div>
          <div className="absolute bottom-1 right-2 text-white text-xs">
            by roy
          </div>
        </div>
        <Button 
          onClick={handleDownload} 
          className="w-full mb-4"
          disabled={!wifiString}
        >
          QR 코드 다운로드
        </Button>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="brandName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-bold text-zinc-900'>브랜드 이름</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="브랜드 이름 입력" />
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="networkName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-bold text-zinc-900'>네트워크 이름(SSID)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="네트워크 이름 입력" />
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-bold text-zinc-900'>비밀번호</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="비밀번호 입력" />
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="encryptionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-bold text-zinc-900'>암호화 유형</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="암호화 유형 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="WPA">WPA/WPA2</SelectItem>
                      <SelectItem value="WEP">WEP</SelectItem>
                      <SelectItem value="nopass">암호 없음</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="backgroundColor"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormLabel>컨테이너 배경색</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="color"
                      className="w-8 h-8 p-0 border-0"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">생성하기</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
