import { Component, OnInit, OnDestroy, HostListener, Inject } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, OnDestroy {
  currentTheme: 'light' | 'dark' = 'light';
  currentLang: 'pt' | 'en' = 'pt';
  menuOpen = false;
  whatsappNumber = '5511999999999';
  
  feedbacks: number[] = [1, 2, 3, 4, 5];
  currentFeedbacks: number[] = [];
  activeFeedbackIndex: number = 0;
  private feedbackInterval: any;

  constructor(@Inject(TranslationService) private translationService: TranslationService) {}

  ngOnInit() {
    // Carregar tema do localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      this.currentTheme = savedTheme;
      document.body.setAttribute('data-theme', savedTheme);
    }

    // Carregar idioma do localStorage ou detectar do navegador
    const savedLang = localStorage.getItem('lang') as 'pt' | 'en';
    if (savedLang) {
      this.currentLang = savedLang;
      this.translationService.setLanguage(savedLang);
    } else {
      const browserLang = navigator.language.startsWith('pt') ? 'pt' : 'en';
      this.currentLang = browserLang;
      this.translationService.setLanguage(browserLang);
    }

    // Inicializar feedbacks
    this.initializeFeedbacks();
    this.startFeedbackCarousel();
  }

  ngOnDestroy() {
    if (this.feedbackInterval) {
      clearInterval(this.feedbackInterval);
    }
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.currentTheme);
    document.body.setAttribute('data-theme', this.currentTheme);
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'pt' ? 'en' : 'pt';
    localStorage.setItem('lang', this.currentLang);
    this.translationService.setLanguage(this.currentLang);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  initializeFeedbacks() {
    // Embaralhar e pegar 3 aleatórios
    const shuffled = [...this.feedbacks].sort(() => Math.random() - 0.5);
    this.currentFeedbacks = shuffled.slice(0, 3);
  }

  startFeedbackCarousel() {
    this.feedbackInterval = setInterval(() => {
      this.activeFeedbackIndex = (this.activeFeedbackIndex + 1) % 3;
    }, 6000);
  }

  @HostListener('window:scroll')
  checkScroll() {
    const scrollElements = document.querySelectorAll('.scroll-animate');
    const windowHeight = window.innerHeight;

    scrollElements.forEach((el) => {
      const elementTop = el.getBoundingClientRect().top;
      if (elementTop < windowHeight - 150) {
        el.classList.add('active');
      }
    });
  }

  abrirWhatsApp(mensagem: string) {
    const mensagemCodificada = encodeURIComponent(mensagem);
    window.open(`https://wa.me/${this.whatsappNumber}?text=${mensagemCodificada}`, '_blank');
  }

  solicitarOrcamento() {
    const mensagem = this.currentLang === 'pt' 
      ? 'Olá! Gostaria de solicitar um orçamento para desenvolvimento de software.'
      : 'Hello! I would like to request a quote for software development.';
    this.abrirWhatsApp(mensagem);
  }

  contatoRapido() {
    const mensagem = this.currentLang === 'pt'
      ? 'Olá! Gostaria de saber mais sobre os serviços da SENTS.'
      : 'Hello! I would like to know more about SENTS services.';
    this.abrirWhatsApp(mensagem);
  }
}
