"use client"
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { File, PlusCircle } from 'lucide-react';

export default function CustomersPage() {
    const [files, setFiles] = useState({
        file1: null,
        file2: null,
        file3: null,
    })
    const handleFileChange = (e:any, key:any) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            setFiles(prev => ({
            ...prev,
            [key]: selectedFile,
            }))
        }
    }

    const handleUpload = async () => {
        if(files.file1 == null || files.file2 == null || files.file3 == null ){
            alert('Please upload all files.')
            return false
        }
        const data = new FormData();
        data.append("icon_file", files.file1);
        data.append("image_file", files.file2);
        data.append("csv_file", files.file3);
        fetch("/api/upload", {
            method: "POST", 
            body: data
        }).then(response => response.json())
        .then(data => {
            alert(data.message);
        })
        .catch(error => {
            console.error(error);
        });
    };
  return (
    <Card>
        <CardHeader>
            <CardTitle>Customers</CardTitle>
            <CardDescription>
                <Button size="sm" variant="outline" className="h-8 gap-1">
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Upload 
                    </span>
                </Button>
                <br /><br /><br />
                <input
                    id="file-upload-1"
                    type="file"
                    onChange={(e) => handleFileChange(e, "file1")}
                />
                <input
                    id="file-upload-2"
                    type="file"
                    onChange={(e) => handleFileChange(e, "file2")}
                />
                <input
                    id="file-upload-3"
                    type="file"
                    onChange={(e) => handleFileChange(e, "file3")}
                />
                <Button size="sm" className="h-8 gap-1" onClick={handleUpload}>
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Generate zip
                    </span>
                </Button>

            </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
    </Card>
  );
}