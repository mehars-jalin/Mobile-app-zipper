// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { formidable } from "formidable";
import { Readable } from "stream";
import AdmZip from 'adm-zip'; 
import path from 'path';
import fs from 'fs';
const Papa = require('papaparse');
const archiver = require('archiver');
import { writeFile } from 'fs/promises';
import MemoryStream from 'memory-streams';
import { PassThrough } from 'stream';
import sharp from "sharp";



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

async function updateFileContent(file_path:any,uploadDir:any){
    const csvContent = fs.readFileSync(file_path, 'utf8');
    const parsed = Papa.parse(csvContent, {
        header: true, // so you get array of objects
        skipEmptyLines: true
    });
    const replacements = parsed.data;
 
    let get_file_updation:any = []
    replacements?.forEach((data:any,key:any)=>{
        if(data.File != ''){
            let file_path   =   data.File.replace(/\\/g, '/'); 
            file_path       =   file_path.replace("ArchiveNAME", '');
            file_path       =   file_path.replace(/\.\./g, '.');
            get_file_updation.push({
                Index: key+1,
                file_path : file_path,
                file_change : data['Hometowne Pizza'],
                line_change : data['Line(s)']
            })
        }
    })

    //console.log('get_file_updation___',get_file_updation)

    const replacement_array:any = [
        "#e0a43d",
        "#000000",
        `website: 'https://metztlitaquerias.com/',
        menu: 'https://metztlitaquerias.com/menus/',
        order: 'https://metztlitaquerias.kulacart.net/',
        catering: 'https://metztlitaquerias.com/catering',
        contact: 'https://metztlitaquerias.com/contact',
        facebook: 'https://www.facebook.com/metztli.taqueria',
        instagram: 'https://www.instagram.com/metztli_taqueria/',
        twitter: 'https://www.facebook.com/metztli.taqueria',
        yelp: 'https://www.yelp.com/biz/metztli-meridian'`,
        `WELCOME TO METZTLI TAQUERIAS{"\\n"}
        WITH TWO LOCATIONS IN MERIDIAN, ID{"\\n"}{"\\n"}
        At Metztli Mexican Taqueria, we are passionate about bringing the vibrant flavors, rich traditions, 
        and warm hospitality of Mexico to the heart of Meridian, Idaho. Our name, Metztli, meaning "moon" in 
        the ancient Nahuatl language, reflects our deep respect for Mexican heritage and the timeless culinary 
        traditions that inspire our menu. {"\\n"} {"\\n"}
        We take pride in crafting every dish with authenticity and care, using high-quality, fresh ingredients 
        that highlight the bold and diverse flavors of Mexico. From our handcrafted tacos, prepared with house-made 
        tortillas and perfectly seasoned meats, to our signature salsas bursting with flavor, every bite is a 
        celebration of tradition. Our menu also features refreshing aguas frescas, expertly crafted cocktails, 
        and a selection of Mexican beers to complement your dining experience. {"\\n"} {"\\n"}
        Beyond the food, Metztli is a place where community and culture come together. We have created a warm and 
        inviting space where friends and family can gather, share a meal, and create lasting memories. 
        Whether you're stopping by for a quick bite, enjoying a leisurely dinner, or celebrating a special occasion, 
        we strive to make every visit feel like home.{"\\n"}{"\\n"}
        We are honored to share the spirit of Mexico with our guests and invite you to experience the flavors, 
        traditions, and hospitality that make Metztli Mexican Taqueria truly special. ¡Bienvenidos y buen provecho!
        Disfruta de una buena comida y bebida con tus amigos y familias.{"\\n"}{"\\n"}`,
        "8AC7E-78896-CBEF3-E7E8A",
        ["Metztli Taquerias","8AC7E-78896-CBEF3-E7E8A"],
        "8AC7E-78896-CBEF3-E7E8A",
        "",
        "8AC7E-78896-CBEF3-E7E8A",
        ["Metztli Taquerias","8AC7E-78896-CBEF3-E7E8A"],
        "#e0a43d",
        "Metztli Taquerias",
        "com.kulaapps.metztlitaquerias",
        "com.kulaapps.metztlitaquerias",
        "com.kulaapps.metztlitaquerias",
        "com.kulaapps.metztlitaquerias",
        "com.kulaapps.metztlitaquerias",
        "Metztli Taquerias",
        "Metztli Taquerias"
    ] 
    get_file_updation.forEach((data:any,key:any)=>{
        let targetContent = ''
        if(replacement_array[key] != undefined && replacement_array[key] != ''){ 
            if (typeof replacement_array[key] === 'object') {
                const change_previous_data = data.file_change.split('\n')
                replacement_array[key].forEach((change_content:any,key:any) => {
                    targetContent = fs.readFileSync(path.join(uploadDir, '/metztlitaquerias/')+data.file_path, 'utf8')
                    targetContent = targetContent.replaceAll(change_content, change_previous_data[key])
                    fs.writeFileSync(path.join(uploadDir, '/metztlitaquerias/')+data.file_path, targetContent, 'utf8')
                });
            }else{
                if(key==2 || key == 3){
                    const escapedReplacement = replacement_array[key].replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s*');
                    let update_array_data = new RegExp(escapedReplacement, 's'); 
                    targetContent = fs.readFileSync(path.join(uploadDir, '/metztlitaquerias/')+data.file_path, 'utf8') 
                    targetContent = targetContent.replace(update_array_data, data.file_change) 
                    fs.writeFileSync(path.join(uploadDir, '/metztlitaquerias/')+data.file_path, targetContent, 'utf8')
                }else{
                    targetContent = fs.readFileSync(path.join(uploadDir, '/metztlitaquerias/')+data.file_path, 'utf8') 
                    targetContent = targetContent.replaceAll(replacement_array[key], data.file_change) 
                    fs.writeFileSync(path.join(uploadDir, '/metztlitaquerias/')+data.file_path, targetContent, 'utf8')
                }
            }
        }
    })

    await fs.promises.rm(file_path, { recursive: true, force: true });

    console.log('Replacements done!');
}


async function createIosImages(files:any) {
    const uploadDir = '/tmp/uploads';
    try{
        const ext = "png";
        const sizes = [
        { name: '20x20', width: 20 ,height: 20},
        { name: '29x29', width: 29 ,height: 29},
        { name: '40x40', width: 40 ,height: 40},
        { name: '50x50', width: 50 ,height: 50},
        { name: '57x57', width: 57 ,height: 57},
        { name: '58x58', width: 58 ,height: 58},
        { name: '60x60', width: 60 ,height: 60},
        { name: '72x72', width: 72 ,height: 72},
        { name: '76x76', width: 76 ,height: 76},
        { name: '80x80', width: 80 ,height: 80},
        { name: '87x87', width: 87 ,height: 87},
        { name: '100x100', width: 100 ,height: 100},
        { name: '114x114', width: 114 ,height: 114},
        { name: '120x120', width: 120 ,height: 120},
        { name: '144x144', width: 144 ,height: 144},
        { name: '152x152', width: 152 ,height: 152},
        { name: '164x164', width: 164 ,height: 164},
        { name: '180x180', width: 180 ,height: 180},
        { name: '1024x1024', width: 1024 ,height: 1024}
        ];
        const fileBuffer = await fs.promises.readFile(files.icon_file[0]?.filepath);
         

        const newIconDir = path.join(uploadDir, '/iosicons/iosicons');
        fs.mkdirSync(newIconDir, { recursive: true });

        const resizeIcons = sizes.map((size) => {
            const outputPath = path.join(newIconDir, `${size.name}.${ext}`);
            return sharp(fileBuffer)
                .resize({ width: size.width, height: size.height })
                .toFile(outputPath);
        });

        await Promise.all(resizeIcons);

        const zip_download_path   =   path.join(uploadDir, '/iosicons.zip')
        const zip_path            =   path.join(uploadDir, '/iosicons')
 
        const output = fs.createWriteStream(zip_download_path);
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        archive.pipe(output);
        archive.directory(zip_path, false);
        const archiveFinalizePromise = new Promise<void>((resolve, reject) => {
            output.on('close', async () => {
              console.log(`Zip created successfully: ${archive.pointer()} bytes`);
              await fs.promises.rm(zip_path, { recursive: true, force: true });
              resolve();
            });
            archive.on('error', (err:any) => {
              console.error('Archiver error:', err);
              reject(err);
            });
        });
        archive.finalize();
        await archiveFinalizePromise;
         
        console.log('IOS Image done!');
        return true;
    } catch (error:any) { 
        console.error('Error IOS:', error.message);
        return false;
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const uploadDir = '/tmp/uploads';
    const form = formidable({
        uploadDir: `${uploadDir}/metztlitaquerias`,
        keepExtensions: true, 
    }); 
    try {  
        // const original_zip_file_path =   path.join(process.cwd(), 'public/metztlitaqueriasOriginal.zip')
        // const extract_original_file_path   =    path.join(uploadDir, '/metztlitaquerias')
        // // Unzip original zipfile 
        // const zip = new AdmZip(original_zip_file_path);
        // zip.extractAllTo(extract_original_file_path, true);
        
        const extract_original_file_path   =    path.join(uploadDir, '/metztlitaquerias')

        const nodeReq = await webRequestToNodeRequest(req);
        
        const [fields, files]:any = await form.parse(nodeReq as any);
        await createIosImages(files);
        //const zip_file_list =   [files.icon_file[0]?.filepath] 
        const zip_file_list = [path.join(uploadDir, 'iosicons.zip')];
        console.log('zip_file_list___',zip_file_list); 
        const csv_file_path = files.csv_file[0]?.filepath
        zip_file_list.forEach(async (file_path)=>{ 
            const zip_file_path =   file_path 
            const zipPath       =   zip_file_path;
            const extractPath   =  path.join(uploadDir, '/metztlitaquerias')
 
            // Unzip file 
            
            const zip = new AdmZip(zipPath);
            zip.extractAllTo(extractPath, true);
            await fs.promises.rm(zip_file_path, { recursive: true, force: true });
        }) 
        await updateFileContent(csv_file_path,uploadDir)

        const zip_download_path   =   path.join(uploadDir, '/metztlitaquerias.zip')
        const zip_path            =   path.join(uploadDir, '/metztlitaquerias')
 

        const output = fs.createWriteStream(zip_download_path);
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        archive.pipe(output);
        archive.directory(zip_path, false);

        const archiveFinalizePromise = new Promise<void>((resolve, reject) => {
            output.on('close', async () => {
              console.log(`Zip created successfully: ${archive.pointer()} bytes`);
              await fs.promises.rm(extract_original_file_path, { recursive: true, force: true });
              //await fs.promises.rm(zip_file_list[0], { recursive: true, force: true });
              resolve();
            });
            archive.on('error', (err:any) => {
              console.error('Archiver error:', err);
              reject(err);
            });
        });

        archive.finalize();

        await archiveFinalizePromise; 
         
        const filePath = path.join(uploadDir, 'metztlitaquerias.zip')
        await fs.promises.access(filePath, fs.constants.F_OK)
        const fileBuffer = await fs.promises.readFile(filePath)
        
        return new Response(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': 'attachment; filename="metztlitaquerias.zip"',
            }
        }); 

        //return NextResponse.json({ message: 'File changes successfully' }); 
    } catch (error:any) { 
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}