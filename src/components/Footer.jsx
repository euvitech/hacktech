import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import Container from './Container';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-900 mt-auto">
      <Container className="py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-semibold text-lg">V</span>
              </div>
              <div>
                <span className="font-semibold text-lg text-gray-900">
                  Vitrine Digital
                </span>
                <div className="text-xs text-gray-500">SCS</div>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              O marketplace que transforma seu bairro em um ecossistema digital integrado.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-6 text-[15px]">Links Rápidos</h4>
            <ul className="space-y-3">
              <li><a href="/catalog" className="text-gray-600 hover:text-blue-600 transition-apple text-sm inline-block min-h-[44px] flex items-center">
                Catálogo
              </a></li>
              <li><a href="/map" className="text-gray-600 hover:text-blue-600 transition-apple text-sm inline-block min-h-[44px] flex items-center">
                Mapa de Lojas
              </a></li>
              <li><a href="/loyalty" className="text-gray-600 hover:text-blue-600 transition-apple text-sm inline-block min-h-[44px] flex items-center">
                Programa de Fidelidade
              </a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-apple text-sm inline-block min-h-[44px] flex items-center">
                Seja um Lojista
              </a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-6 text-[15px]">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-600 text-sm">
                <MapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <span>Bairro SCS, Goiânia - GO</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 text-sm">
                <Phone size={18} className="text-gray-400 flex-shrink-0" />
                <span>(62) 99999-9999</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 text-sm">
                <Mail size={18} className="text-gray-400 flex-shrink-0" />
                <span>contato@vitrinescs.com.br</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-6 text-[15px]">Redes Sociais</h4>
            <div className="flex gap-3">
              <a href="#" className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-900 hover:text-white transition-apple">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-900 hover:text-white transition-apple">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-900 hover:text-white transition-apple">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-sm">&copy; 2025 Vitrine Digital SCS. Todos os direitos reservados.</p>
        </div>
      </Container>
    </footer>
  );
}
