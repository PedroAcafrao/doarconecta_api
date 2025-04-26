'use client'
import React, { useState } from "react";
import Image from "next/image";
//import { useRouter } from "next/router";
import Link from "next/link";
import { NextRequest, NextResponse } from "next/server";

// Tipo para representar uma doação
interface Donation {
    id: number;
    category: string;
    state: string;
    city: string;
    description: string;
    imageUrl: string;
}

// Tipo para representar o usuário (exemplo)
interface User {
    name: string;
    avatarUrl: string;
}

export default function DonationsPage(req:NextRequest,res:NextResponse) {
    // Informações do usuário (exemplo)
    const user: User = {
        name: "João Silva",
        avatarUrl: "/profile-avatar.jpg", // Substitua com o caminho real da imagem
    };

    const [donations, setDonations] = useState<Donation[]>([
        { id: 1, category: 'Alimentos', state: 'SP', city: 'São Paulo', description: 'Doação de alimentos não perecíveis.', imageUrl: '/donations/food.jpg' },
        { id: 2, category: 'Roupas', state: 'RJ', city: 'Rio de Janeiro', description: 'Doação de roupas de inverno.', imageUrl: '/donations/clothes.jpg' },
        { id: 3, category: 'Brinquedos', state: 'MG', city: 'Belo Horizonte', description: 'Brinquedos para crianças.', imageUrl: '/donations/toys.jpg' },
        { id: 4, category: 'Móveis', state: 'BA', city: 'Salvador', description: 'Doação de móveis usados.', imageUrl: '/donations/furniture.jpg' },
        { id: 5, category: 'Livros', state: 'SP', city: 'Campinas', description: 'Livros infantis e educativos.', imageUrl: '/donations/books.jpg' },
    ]);

    const [categoryFilter, setCategoryFilter] = useState('');
    const [stateFilter, setStateFilter] = useState('');
    const [cityFilter, setCityFilter] = useState('');

    const filteredDonations = donations.filter((donation) => {
        return (
            (categoryFilter ? donation.category.toLowerCase().includes(categoryFilter.toLowerCase()) : true) &&
            (stateFilter ? donation.state.toLowerCase().includes(stateFilter.toLowerCase()) : true) &&
            (cityFilter ? donation.city.toLowerCase().includes(cityFilter.toLowerCase()) : true)
        );
    });

    //const router = useRouter();

    const handleAddDonation = () => {
        console.log("Abrir formulário para adicionar nova doação");
    };
    const logout =async ()=>{
        await fetch('/api/logout',{
            credentials:'include'
        })
        return window.location.reload()

    }

    return (
        <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-white">
            <header className="w-full flex justify-between items-center p-6 bg-white rounded-lg shadow-xl">
                <div className="flex items-center gap-4">
                    <Image
                        src={user.avatarUrl}
                        alt="User Avatar"
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    <div>
                        <p className="text-xl font-semibold text-blue-700">{user.name}</p>
                        <p className="text-sm text-gray-600">Bem-vindo de volta!</p>
                    </div>
                </div>

                <div>
                    <Link href="/login">
                        <button
                            onClick={logout}
                            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                            Sair
                        </button>
                    </Link>
                </div>
            </header>

            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full text-gray-900">
                <h1 className="text-4xl font-extrabold text-blue-700">Lista de Doações</h1>

                {/* Filtros */}
                <div className="flex flex-col gap-4 sm:flex-row w-full">
                    <div className="w-full sm:w-1/3">
                        <label className="block text-sm font-medium text-blue-700">Categoria:</label>
                        <input
                            type="text"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="border border-blue-300 rounded-lg p-3 w-full bg-white"
                            placeholder="Filtrar por categoria"
                        />
                    </div>

                    <div className="w-full sm:w-1/3">
                        <label className="block text-sm font-medium text-blue-700">Estado:</label>
                        <input
                            type="text"
                            value={stateFilter}
                            onChange={(e) => setStateFilter(e.target.value)}
                            className="border border-blue-300 rounded-lg p-3 w-full bg-white"
                            placeholder="Filtrar por estado"
                        />
                    </div>

                    <div className="w-full sm:w-1/3">
                        <label className="block text-sm font-medium text-blue-700">Cidade:</label>
                        <input
                            type="text"
                            value={cityFilter}
                            onChange={(e) => setCityFilter(e.target.value)}
                            className="border border-blue-300 rounded-lg p-3 w-full bg-white"
                            placeholder="Filtrar por cidade"
                        />
                    </div>
                </div>
                <Link href="/doacoes">
                    <button
                        onClick={handleAddDonation}
                        className="rounded-full bg-blue-700 text-white py-3 px-6 hover:bg-blue-800 font-medium text-lg mt-6 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Cadastrar Nova Doação
                    </button>
                </Link>


                {/* Lista de doações */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8 w-full">
                    {filteredDonations.map((donation) => (
                        <div key={donation.id} className="relative bg-white p-6 rounded-lg shadow-xl group hover:bg-blue-50 transition duration-300">
                            <Image
                                src={donation.imageUrl}
                                alt={donation.category}
                                width={400}
                                height={250}
                                className="object-cover w-full h-56 rounded-lg mb-4 transition-transform transform group-hover:scale-105"
                            />
                            <h3 className="text-xl font-bold text-blue-800">{donation.category}</h3>
                            <p className="text-sm text-gray-600 mt-2">{donation.description}</p>
                            <p className="text-sm italic text-gray-500 mt-2">{donation.city} - {donation.state}</p>
                            <div className="absolute top-2 right-2 bg-blue-700 text-white text-sm px-4 py-1 rounded-full opacity-0 group-hover:opacity-100 transition duration-300">
                                Ver mais
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="row-start-3 flex gap-4 flex-wrap items-center justify-center text-gray-900">
                <a
                    className="hover:underline text-lg"
                    href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn
                </a>
                <a
                    className="hover:underline text-lg"
                    href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Exemplos
                </a>
                <a
                    className="hover:underline text-lg"
                    href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Go to nextjs.org →
                </a>
            </footer>
        </div>
    );
}