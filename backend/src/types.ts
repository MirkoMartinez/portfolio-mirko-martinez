// backend/src/types.ts
export type EstadoPublicacion = "Publicado" | "En desarrollo" | "Privado";

export interface Proyecto {
    _id?: string;
    nombre: string;
    descripcion: string;
    tecnologias: string[];
    imagenUrl: string;
    estado: EstadoPublicacion;
}