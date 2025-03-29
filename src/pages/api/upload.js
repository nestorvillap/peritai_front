

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
const S3_ENDPOINT = process.env.S3_ENDPOINT;
const S3_REGION = process.env.S3_REGION;

const s3Client = new S3Client({
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY
  },
  endpoint: S3_ENDPOINT,
  region: S3_REGION,
  forcePathStyle: true
});

export async function POST({ request }) {
  try {
    const formData = await request.formData();
    const plate = formData.get('plate');
    const carModel = formData.get('carModel');
    const year = formData.get('year');

    // Procesar cada imagen
    const imageTypes = ['frontal', 'parte trasera', 'lateral izquierdo', 'lateral derecho'];
    const uploadedImages = [];

    for (const type of imageTypes) {
      const file = formData.get(`carImage-${type}`);
      if (!file) {
        throw new Error(`Falta la imagen ${type}`);
      }

      const timestamp = Date.now();
      const extension = file.name.split('.').pop();
      const fileKey = `cars/${plate.replace(/\s+/g, '-')}-${type}-${timestamp}.${extension}`;
      
      const buffer = await file.arrayBuffer();

      const params = {
        Bucket: 'movilidad-internacional',
        Key: fileKey,
        Body: buffer,
        ContentType: file.type,
        ACL: 'public-read'
      };

      const command = new PutObjectCommand(params);
      await s3Client.send(command);
      
      const fileUrl = `${S3_ENDPOINT}/movilidad-internacional/${fileKey}`;
      uploadedImages.push({
        url: fileUrl,
        tipo: type
      });
    }

    const backendResponse = await fetch('http://127.0.0.1:8000/evaluations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        matricula: plate,
        marca: carModel,
        modelo: carModel,
        anio: year,
        imagenes: uploadedImages
      })
    });

    if (!backendResponse.ok) {
      throw new Error(`Failed to sync with backend`);
    }

    const backendData = await backendResponse.json();
    
    return new Response(JSON.stringify({ 
      success: true, 
      evaluation_id: backendData.evaluation_id 
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error en la subida:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
