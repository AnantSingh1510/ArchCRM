"use client"

import { UploadCloud, X, File as FileIcon } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { useState } from "react"

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
}

export function FileUpload({ onFilesChange }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles]
    setFiles(newFiles)
    onFilesChange(newFiles)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const removeFile = (fileToRemove: File) => {
    const newFiles = files.filter((file) => file !== fileToRemove)
    setFiles(newFiles)
    onFilesChange(newFiles)
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
          isDragActive ? "border-primary" : "border-border"
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">
          {isDragActive ? "Drop the files here ..." : "Drag 'n' drop some files here, or click to select files"}
        </p>
      </div>
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
              <div className="flex items-center gap-2">
                <FileIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{file.name}</span>
              </div>
              <button onClick={() => removeFile(file)} className="p-1 hover:bg-destructive/10 rounded-full">
                <X className="h-4 w-4 text-destructive" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
