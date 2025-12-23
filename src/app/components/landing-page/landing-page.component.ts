import { Component, OnInit, OnDestroy, HostListener, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, OnDestroy, AfterViewInit {
  scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
  currentTheme: 'light' | 'dark' = 'light';
  currentLang: 'pt' | 'en' = 'pt';
  menuOpen = false;
  whatsappNumber = '5579981784501';
  
  feedbacks: number[] = [1, 2, 3, 4, 5];
  currentFeedbacks: number[] = [];
  activeFeedbackIndex: number = 0;
  private feedbackInterval: any;

  @ViewChild('carouselTrack') carouselTrack!: ElementRef<HTMLDivElement>;
  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;

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

  ngAfterViewInit() {
    this.setupDragScroll();
  }

  ngOnDestroy() {
    if (this.feedbackInterval) {
      clearInterval(this.feedbackInterval);
    }
  }

  setupDragScroll() {
    if (!this.carouselTrack) return;

    const track = this.carouselTrack.nativeElement;

    track.addEventListener('mousedown', (e: MouseEvent) => {
      this.isDragging = true;
      track.classList.add('dragging');
      this.startX = e.pageX - track.offsetLeft;
      this.scrollLeft = track.scrollLeft;
    });

    track.addEventListener('mouseleave', () => {
      this.isDragging = false;
      track.classList.remove('dragging');
    });

    track.addEventListener('mouseup', () => {
      this.isDragging = false;
      track.classList.remove('dragging');
      this.updateActiveSlide();
    });

    track.addEventListener('mousemove', (e: MouseEvent) => {
      if (!this.isDragging) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - this.startX) * 2;
      track.scrollLeft = this.scrollLeft - walk;
    });

    // Touch events para mobile
    track.addEventListener('touchstart', (e: TouchEvent) => {
      this.startX = e.touches[0].pageX - track.offsetLeft;
      this.scrollLeft = track.scrollLeft;
    });

    track.addEventListener('touchmove', (e: TouchEvent) => {
      const x = e.touches[0].pageX - track.offsetLeft;
      const walk = (x - this.startX) * 2;
      track.scrollLeft = this.scrollLeft - walk;
    });

    track.addEventListener('touchend', () => {
      this.updateActiveSlide();
    });
  }

  updateActiveSlide() {
    if (!this.carouselTrack) return;
    
    const track = this.carouselTrack.nativeElement;
    const slideWidth = 320 + 16; // width + gap
    const index = Math.round(track.scrollLeft / slideWidth);
    this.activeFeedbackIndex = Math.max(0, Math.min(index, 4));
  }

  scrollToSlide(index: number) {
    if (!this.carouselTrack) return;
    
    this.activeFeedbackIndex = index;
    const track = this.carouselTrack.nativeElement;
    const slideWidth = 320 + 16; // width + gap
    track.scrollTo({
      left: index * slideWidth,
      behavior: 'smooth'
    });
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
