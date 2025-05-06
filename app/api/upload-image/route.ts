// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { formidable } from "formidable";
import { Readable } from "stream";
import AdmZip from 'adm-zip'; 
import path from 'path';
import fs from 'fs';
const Papa = require('papaparse');
const archiver = require('archiver');

export const config = {
  api: {
    bodyParser: false,
  },
};

async function webRequestToNodeRequest(req: Request) {
    const reader = req.body?.getReader(); 
    const nodeReq = new Readable({
        async read() {
        if (!reader) return this.push(null);
        const { done, value } = await reader.read();
        if (done) return this.push(null);
            this.push(value);
        },
    });

    // Add required headers manually
    (nodeReq as any).headers = {
        "content-type": req.headers.get("content-type") || "",
        "content-length": req.headers.get("content-length") || "",
    };

    return nodeReq;
}
export async function POST(req: Request) {
    const uploadDir = '/tmp/uploads';
    const form = formidable({
        uploadDir: `${uploadDir}/metztlitaquerias`,
        keepExtensions: true, 
    }); 
    try { 
        const original_zip_file_path =   path.join(process.cwd(), `public/metztlitaqueriasOriginal.zip`)
        const extract_original_file_path   =   path.join(process.cwd(), `${uploadDir}/metztlitaquerias`);
        // Unzip original zipfile 
        const zip = new AdmZip(original_zip_file_path);
        zip.extractAllTo(extract_original_file_path, true);

        const nodeReq = await webRequestToNodeRequest(req);
        const [fields, files]:any = await form.parse(nodeReq as any);
        const zip_file_list =   [files.image_file[0]?.filepath]  
        zip_file_list.forEach(async (file_path)=>{ 
            const zip_file_path =   file_path 
            const zipPath       =   zip_file_path;
            const extractPath   =   path.join(process.cwd(), `${uploadDir}/metztlitaquerias/`);
 
            // Unzip file
            const zip = new AdmZip(zipPath);
            zip.extractAllTo(extractPath, true);
            //await fs.promises.rm(zip_file_path, { recursive: true, force: true });
        }) 
        return NextResponse.json({ message: 'File changes successfully', files }); 
    } catch (error:any) {  
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
