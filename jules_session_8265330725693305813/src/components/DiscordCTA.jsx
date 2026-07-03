import React from 'react';

export default function DiscordCTA() {
  return (
    <div className="w-full max-w-2xl mx-auto my-10 p-8 border border-[#5865F2]/30 bg-gradient-to-b from-[#5865F2]/10 to-transparent rounded-2xl flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-[#5865F2] rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(88,101,242,0.4)]">
        <svg width="32" height="32" viewBox="0 0 127.14 96.36" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96,46,95.89,53,90.84,65.69,84.69,65.69Z" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold mb-2">Ansioso pelo próximo capítulo?</h3>
      <p className="text-zinc-400 mb-6 max-w-md">Não espere pelos algoritmos! Os membros do nosso Discord recebem as atualizações horas antes de todo mundo.</p>
      <a href="https://discord.gg/seu-link" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-xl transition transform hover:-translate-y-1 hover:shadow-lg w-full sm:w-auto">
        Entrar no Santuário
      </a>
    </div>
  );
}
