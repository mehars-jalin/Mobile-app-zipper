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
import { File, PlusCircle, Download } from 'lucide-react';

const MAX_SIZE = 4.5 * 1024 * 1024; // 4.5 MB
const MAX_SIZE_CSV = 2 * 1024 * 1024; // 2 MB
const allowedMimeTypes = ['application/zip', 'application/x-zip-compressed'];
const allowedCsvMimeTypes = [
    'text/csv',
    'application/vnd.ms-excel',
  ];


export default function CustomersPage() {
    const [files, setFiles] = useState({
        file1: null,
        file2: null,
        file3: null,
    })
    const [fileUpdate, setFileUpdate] = useState(false);
    const [loading, setLoading] = useState(false); // Loader state

    const handleFileChange = (e: any, key: any) => {
        const selectedFile:any = e.target.files[0];
        if (selectedFile) {
            setFiles(prev => ({
                ...prev,
                [key]: selectedFile,
            }));
        }
    }
 
    async function uploadCsv(data:any){
        const response = await fetch("/api/upload-csv", {
            method: "POST", 
            body: data
        });
        const result = await response.blob();
        return result
    }
    const handleUpload = async () => { 
        if (files.file1 == null || files.file2 == null || files.file3 == null) {
            alert('Please upload all files.');
            return false;
        } 
 
        if (
            !(files.file1 as any).name?.endsWith('.zip') ||
            !(files.file2 as any).name?.endsWith('.zip') ||
            !(files.file3 as any).name?.endsWith('.csv')
        ) {
            alert('Only ZIP and CSV files are allowed.');
            return false;
        }
          

        if ((files.file1 as any).size > MAX_SIZE_CSV) {
            alert(`Icon zip size not more than 2 MB.`);
            return false;
        }
        if ((files.file2 as any).size > MAX_SIZE) {
            alert(`Image zip size not more than 4 MB.`);
            return false;
        }
        if ((files.file3 as any).size > MAX_SIZE_CSV) {
            alert(`CSV zip size not more than 2 MB.`);
            return false;
        }
        const image_data = new FormData();
        const csv_data = new FormData();
        image_data.append("image_file", files.file2);
        setLoading(true); // Start loading
        
        try {
            const response = await fetch("/api/upload-image", {
                method: "POST", 
                body: image_data
            });
            await response.json(); 

            csv_data.append("icon_file", files.file1);
            csv_data.append("csv_file", files.file3);

            const blob = await uploadCsv(csv_data) 
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'metztlitaquerias.zip';
            document.body.appendChild(a);
            a.click();
            a.remove();

            alert('File changes successfully');
            setFileUpdate(true); 
        } catch (error:any) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false); // Stop loading after the request
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Client</CardTitle>
                <CardDescription>Select your files below to generate a zip file.</CardDescription>
            </CardHeader>

            <CardContent>
                {/* File Uploads in one line */}
                <div className="flex flex-wrap gap-8 items-center justify-center">
                    {/* Icon File */}
                    <div className="flex flex-col items-center">
                        <label htmlFor="file-upload-1" className="text-sm font-medium mb-2">
                            Icons Zip
                        </label>
                        <input
                            id="file-upload-1"
                            type="file"
                            onChange={(e) => handleFileChange(e, "file1")}
                            className="border p-2 rounded w-60"
                        />
                    </div>

                    {/* Image File */}
                    <div className="flex flex-col items-center">
                        <label htmlFor="file-upload-2" className="text-sm font-medium mb-2">
                            Images Zip
                        </label>
                        <input
                            id="file-upload-2"
                            type="file"
                            onChange={(e) => handleFileChange(e, "file2")}
                            className="border p-2 rounded w-60"
                        />
                    </div>

                    {/* CSV File */}
                    <div className="flex flex-col items-center">
                        <label htmlFor="file-upload-3" className="text-sm font-medium mb-2">
                            CSV file
                        </label>
                        <input
                            id="file-upload-3"
                            type="file"
                            onChange={(e) => handleFileChange(e, "file3")}
                            className="border p-2 rounded w-60"
                        />
                    </div>
                </div>

                {/* Button in next line */}
                <div className="flex justify-center mt-6">
                    <Button
                        size="sm"
                        className="h-9 flex items-center gap-2"
                        onClick={handleUpload}
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? (
                            <div className="animate-spin h-4 w-4 border-2 border-t-2 border-t-transparent rounded-full" />
                        ) : (
                            <PlusCircle className="h-4 w-4" />
                        )}
                        <span>{loading ? "Uploading..." : "Generate Zip"}</span>
                    </Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    
                    {/* {fileUpdate && !loading ? (
                        <a href="/tmp/uploads/metztlitaquerias.zip" className="h-9 flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            <span>Download Zip</span>
                        </a>
                    ) : ''} */}
                </div>
            </CardContent>
        </Card>
    );
}