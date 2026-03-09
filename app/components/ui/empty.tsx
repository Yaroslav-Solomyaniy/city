import React from 'react';
import {PackageOpen, Trash2} from "lucide-react";
import {Button} from "@/app/components/ui/button";


const Empty = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-2 py-12">
            <PackageOpen size={48} style={{ color: 'var(--text-muted)', opacity: 0.75 }} />
            <p className="text-[16px] m-0" style={{ color: 'var(--text-muted)' }}>
                Ой, тут пусто)
            </p>

            <div>

                <Button variant="primary">Зберегти</Button>
                <Button variant="secondary">Скасувати</Button>
                <Button variant="blue">Скасувати</Button>
                <Button variant="danger" loading={true} loadingText="Видаляємо...">Так, видалити</Button>
                <Button variant="ghost">Текстова кнопка</Button>
                <Button variant="icon" onClick={() => console.log()}><Trash2 size={14} /></Button>


                // з розміром
                <Button variant="primary" size="sm">Маленька</Button>
            </div>
        </div>


    );
};

export default Empty;