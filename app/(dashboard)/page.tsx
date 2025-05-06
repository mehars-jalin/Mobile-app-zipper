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

export default function CustomersPage() {
    const [files, setFiles] = useState({
        file1: null,
        file2: null,
        file3: null,
    })
    const [fileUpdate, setFileUpdate] = useState(false);
    const [loading, setLoading] = useState(false); // Loader state

    const handleFileChange = (e: any, key: any) => {
        const selectedFile = e.target.files[0];
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
        const result = await response.json();
        return result
    }
    const handleUpload = async () => {
        if (files.file1 == null || files.file2 == null || files.file3 == null) {
            alert('Please upload all files.');
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
            const csv_response = await uploadCsv(csv_data)
            alert(csv_response.message);
            setFileUpdate(true); 
        } catch (error) {
            console.error(error);
            alert("Upload failed.");
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
                    
                    {fileUpdate && !loading ? (
                        <a href="/metztlitaquerias.zip" className="h-9 flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            <span>Download Zip</span>
                        </a>
                    ) : ''}
                </div>
            </CardContent>
        </Card>
    );
}