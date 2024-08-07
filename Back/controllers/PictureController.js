import Picture from "../models/Picture.js";
import fs from 'fs'

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const create = async(req, res) => {
    try {
        const {name, description} = req.body;
        const file = req.file;
        const picture = new Picture({
            name,
            description,
            src: file.path,
        });
        await picture.save()
        res.json({picture, msg: "Arquivo salva com sucesso!"})
    } catch (error) {
        res.status(500).json({
            message: "Erro sao salvar Arquivo"
        })
    }
}

export const findAll = async(req, res) => {
    try {

        const pictures = await Picture.find()
        
        res.json(pictures);
    } catch (error) {
        res.status(500).json({message: "Erro ao buscar arquivos"})
    }
}
export const update = async(req, res) => {
    try {
        const { name, description } = req.body;
        const file = req.file;

        const picture = await Picture.findById(req.params.id);
        if (!picture) {
            return res.status(404).json({ message: "Arquivo não encontrada" });
        }
        picture.name = name || picture.name;
        picture.description = description || picture.description;

        if (file) {
            if (picture.src) {
                fs.unlinkSync(join(__dirname, '..', picture.src));
            }
            picture.src = file.path;
        }
        await picture.save();
        res.json({ picture, msg: "Arquivo atualizado com sucesso!" });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: "Erro ao atualizar arquivo" });
    }
}

export const findById = async(req, res) => {
    try {

        const pictures = await Picture.findById(req.params.id)
        
        res.json(pictures);
    } catch (error) {   
        res.status(500).json({message: "Erro ao buscar arquivos"})
    }
}
export const download = async(req, res) => {
    try {
        const file = join(__dirname, '../uploads', req.params.fileName);
     
        res.setHeader('Content-Disposition', `attachment; filename="${req.params.fileName}"`);
        res.sendFile(file);
    } catch (error) {
        res.status(500).json({message: "Erro ao buscar arquivos"})
    }
}

export const deleteFile = async(req, res) => {
    try {
        const picture = await Picture.findById(req.params.id)
        if(!picture){
            return res.status(404).json({message: "Arquivo não encontrado"})
        }

        fs.unlinkSync(picture.src)
        
        await picture.deleteOne()

        res.json({message: "Arquivo removida com sucesso!"})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Erro ao excluir arquivo"})
    }
}