"use client"
import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import api from '@/lib/api/axios'

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' ||
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        selectedFile.type === 'application/vnd.ms-excel') {
        setFile(selectedFile)
        setError(null)
      } else {
        setError('Please upload only CSV or Excel files')
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await api.post('/question/uploadExcel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.status === 201) {
        setSuccess(true)
        toast({
          title: "Success",
          description: "Questions uploaded successfully",
        })
      }
    } catch (err) {
      setError('Failed to upload file. Please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto  flex  justify-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Upload Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 flex flex-col items-center">
            <div className="grid w-full items-center gap-1.5">
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              <p className="text-sm text-gray-500 text-center">
                Supported formats: CSV, XLSX, XLS
              </p>
            </div>

            <Button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full"
            >
              {loading ? (
                "Uploading..."
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </>
              )}
            </Button>

            {error && (
              <Alert variant="destructive" className="w-full">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-100 w-full">
                <CheckCircle className="h-4 w-4 text-black" />
                <AlertTitle className="text-green-600">Success</AlertTitle>
                <AlertDescription className="text-green-600">
                  File uploaded successfully
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UploadPage