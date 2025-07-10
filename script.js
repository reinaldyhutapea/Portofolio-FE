// Ultra Advanced Portfolio JavaScript
// Reinaldy Hutapea - Information Systems Student

// Global Variables and Configuration
const CONFIG = {
  // Animation settings
  ANIMATION_DURATION: 300,
  SCROLL_THRESHOLD: 100,
  TYPING_SPEED: 100,
  TYPING_DELAY: 2000,

  // Performance settings
  THROTTLE_DELAY: 16,
  DEBOUNCE_DELAY: 250,

  // Particle system settings
  PARTICLE_COUNT: 50,
  PARTICLE_SPEED: 0.5,
  PARTICLE_SIZE: 2,

  // Loading settings
  LOADING_DURATION: 3000,
  LOADING_STEPS: 100,

  // Theme settings
  THEME_STORAGE_KEY: "portfolio-theme",

  // Contact form settings
  FORM_VALIDATION_DELAY: 500,

  // Skill levels for radar chart
  SKILL_LEVELS: {
    Python: 90,
    Java: 85,
    Flutter: 85,
    "ML/AI": 88,
    "Data Science": 92,
    "Web Dev": 80,
    "Mobile Dev": 85,
    Database: 82,
  },
}

// Utility Functions
const Utils = {
  // Throttle function for performance optimization
  throttle(func, delay) {
    let timeoutId
    let lastExecTime = 0
    return function (...args) {
      const currentTime = Date.now()

      if (currentTime - lastExecTime > delay) {
        func.apply(this, args)
        lastExecTime = currentTime
      } else {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(
          () => {
            func.apply(this, args)
            lastExecTime = Date.now()
          },
          delay - (currentTime - lastExecTime),
        )
      }
    }
  },

  // Debounce function for input handling
  debounce(func, delay) {
    let timeoutId
    return function (...args) {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(this, args), delay)
    }
  },

  // Smooth scroll to element
  smoothScrollTo(element, offset = 0) {
    const targetPosition = element.offsetTop - offset
    const startPosition = window.pageYOffset
    const distance = targetPosition - startPosition
    const duration = 800
    let start = null

    function animation(currentTime) {
      if (start === null) start = currentTime
      const timeElapsed = currentTime - start
      const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration)
      window.scrollTo(0, run)
      if (timeElapsed < duration) requestAnimationFrame(animation)
    }

    requestAnimationFrame(animation.bind(this))
  },

  // Easing function for smooth animations
  easeInOutQuad(t, b, c, d) {
    t /= d / 2
    if (t < 1) return (c / 2) * t * t + b
    t--
    return (-c / 2) * (t * (t - 2) - 1) + b
  },

  // Generate random number between min and max
  random(min, max) {
    return Math.random() * (max - min) + min
  },

  // Check if element is in viewport
  isInViewport(element, threshold = 0.1) {
    const rect = element.getBoundingClientRect()
    const windowHeight = window.innerHeight || document.documentElement.clientHeight
    const windowWidth = window.innerWidth || document.documentElement.clientWidth

    return (
      rect.top <= windowHeight * (1 - threshold) &&
      rect.bottom >= windowHeight * threshold &&
      rect.left <= windowWidth * (1 - threshold) &&
      rect.right >= windowWidth * threshold
    )
  },

  // Format number with animation
  animateNumber(element, start, end, duration = 2000) {
    const startTime = performance.now()
    const isDecimal = end % 1 !== 0

    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      const current = start + (end - start) * this.easeInOutQuad(progress, 0, 1, 1)
      element.textContent = isDecimal ? current.toFixed(2) : Math.floor(current)

      if (progress < 1) {
        requestAnimationFrame(updateNumber.bind(this))
      }
    }

    requestAnimationFrame(updateNumber.bind(this))
  },

  // Create ripple effect
  createRipple(event, element) {
    const ripple = document.createElement("div")
    const rect = element.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1000;
        `

    element.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 600)
  },
}

// Loading Screen Manager
class LoadingManager {
  constructor() {
    this.loadingScreen = document.getElementById("loadingScreen")
    this.progressBar = document.getElementById("progressBar")
    this.loadingPercentage = document.getElementById("loadingPercentage")
    this.loadingText = document.querySelector(".loading-text")

    this.currentProgress = 0
    this.targetProgress = 0
    this.isLoading = true

    this.loadingMessages = [
      "Initializing portfolio...",
      "Loading components...",
      "Preparing animations...",
      "Setting up interactions...",
      "Optimizing performance...",
      "Almost ready...",
      "Welcome!",
    ]

    this.init()
  }

  init() {
    this.simulateLoading()
    this.updateLoadingText()
  }

  simulateLoading() {
    const steps = [10, 25, 40, 60, 75, 90, 100]
    let currentStep = 0

    const updateProgress = () => {
      if (currentStep < steps.length) {
        this.setProgress(steps[currentStep])
        currentStep++
        setTimeout(updateProgress, CONFIG.LOADING_DURATION / steps.length)
      } else {
        setTimeout(() => this.hideLoading(), 500)
      }
    }

    setTimeout(updateProgress, 500)
  }

  setProgress(progress) {
    this.targetProgress = progress
    this.animateProgress()
  }

  animateProgress() {
    const animate = () => {
      if (this.currentProgress < this.targetProgress) {
        this.currentProgress += 2
        this.progressBar.style.width = `${this.currentProgress}%`
        this.loadingPercentage.textContent = `${this.currentProgress}%`
        requestAnimationFrame(animate)
      }
    }
    animate()
  }

  updateLoadingText() {
    let messageIndex = 0
    const updateMessage = () => {
      if (messageIndex < this.loadingMessages.length && this.isLoading) {
        this.loadingText.textContent = this.loadingMessages[messageIndex]
        messageIndex++
        setTimeout(updateMessage, CONFIG.LOADING_DURATION / this.loadingMessages.length)
      }
    }
    updateMessage()
  }

  hideLoading() {
    this.isLoading = false
    this.loadingScreen.classList.add("hidden")

    setTimeout(() => {
      this.loadingScreen.style.display = "none"
      document.body.classList.add("loaded")
      this.initializeMainContent()
    }, 500)
  }

  initializeMainContent() {
    // Initialize all other components after loading
    window.portfolioApp = new PortfolioApp()
  }
}

// Theme Manager
class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById("themeToggle")
    this.currentTheme = localStorage.getItem(CONFIG.THEME_STORAGE_KEY) || "light"

    this.init()
  }

  init() {
    this.applyTheme(this.currentTheme)
    this.bindEvents()
  }

  bindEvents() {
    this.themeToggle?.addEventListener("click", () => {
      this.toggleTheme()
    })
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === "light" ? "dark" : "light"
    this.applyTheme(this.currentTheme)
    localStorage.setItem(CONFIG.THEME_STORAGE_KEY, this.currentTheme)
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme)

    // Update theme toggle appearance
    const track = this.themeToggle?.querySelector(".toggle-track")
    if (track) {
      track.style.background = theme === "dark" ? "var(--primary-600)" : "var(--secondary-300)"
    }
  }
}

// Custom Cursor Manager
class CursorManager {
  constructor() {
    this.cursor = null
    this.cursorDot = null
    this.isTouch = "ontouchstart" in window

    if (!this.isTouch) {
      this.init()
    }
  }

  init() {
    this.createCursor()
    this.bindEvents()
  }

  createCursor() {
    // Create cursor follower
    this.cursor = document.createElement("div")
    this.cursor.className = "cursor-follower"
    document.body.appendChild(this.cursor)

    // Create cursor dot
    this.cursorDot = document.createElement("div")
    this.cursorDot.className = "cursor-dot"
    document.body.appendChild(this.cursorDot)
  }

  bindEvents() {
    let mouseX = 0,
      mouseY = 0
    let cursorX = 0,
      cursorY = 0

    // Mouse move handler
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      // Update dot position immediately
      this.cursorDot.style.left = mouseX + "px"
      this.cursorDot.style.top = mouseY + "px"

      // Show cursors
      this.cursor.classList.add("active")
      this.cursorDot.classList.add("active")
    })

    // Animate cursor follower
    const animateCursor = () => {
      const dx = mouseX - cursorX
      const dy = mouseY - cursorY

      cursorX += dx * 0.1
      cursorY += dy * 0.1

      this.cursor.style.left = cursorX + "px"
      this.cursor.style.top = cursorY + "px"

      requestAnimationFrame(animateCursor)
    }
    animateCursor()

    // Hover effects
    const hoverElements = document.querySelectorAll("a, button, .btn, .nav-link, .social-link")
    hoverElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        this.cursor.classList.add("hover")
      })

      element.addEventListener("mouseleave", () => {
        this.cursor.classList.remove("hover")
      })
    })

    // Hide cursor when leaving window
    document.addEventListener("mouseleave", () => {
      this.cursor.classList.remove("active")
      this.cursorDot.classList.remove("active")
    })
  }
}

// Particle System
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.particles = []
    this.animationId = null

    this.init()
  }

  init() {
    this.resizeCanvas()
    this.createParticles()
    this.animate()

    window.addEventListener(
      "resize",
      Utils.throttle(() => {
        this.resizeCanvas()
      }, CONFIG.THROTTLE_DELAY),
    )
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  createParticles() {
    this.particles = []
    for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * CONFIG.PARTICLE_SPEED,
        vy: (Math.random() - 0.5) * CONFIG.PARTICLE_SPEED,
        size: Math.random() * CONFIG.PARTICLE_SIZE + 1,
        opacity: Math.random() * 0.5 + 0.2,
        hue: Math.random() * 60 + 200, // Blue to purple range
      })
    }
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx
      particle.y += particle.vy

      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width
      if (particle.x > this.canvas.width) particle.x = 0
      if (particle.y < 0) particle.y = this.canvas.height
      if (particle.y > this.canvas.height) particle.y = 0

      // Subtle size animation
      particle.size += Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.01
    })
  }

  drawParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.particles.forEach((particle) => {
      this.ctx.save()
      this.ctx.globalAlpha = particle.opacity
      this.ctx.fillStyle = `hsl(${particle.hue}, 70%, 60%)`
      this.ctx.beginPath()
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      this.ctx.fill()
      this.ctx.restore()
    })

    // Draw connections between nearby particles
    this.drawConnections()
  }

  drawConnections() {
    const maxDistance = 100

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x
        const dy = this.particles[i].y - this.particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.2
          this.ctx.save()
          this.ctx.globalAlpha = opacity
          this.ctx.strokeStyle = "hsl(220, 70%, 60%)"
          this.ctx.lineWidth = 1
          this.ctx.beginPath()
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y)
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y)
          this.ctx.stroke()
          this.ctx.restore()
        }
      }
    }
  }

  animate() {
    this.updateParticles()
    this.drawParticles()
    this.animationId = requestAnimationFrame(() => this.animate())
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
  }
}

// Navigation Manager
class NavigationManager {
  constructor() {
    this.nav = document.getElementById("mainNav")
    this.navLinks = document.querySelectorAll(".nav-link")
    this.menuToggle = document.getElementById("menuToggle")
    this.navMenu = document.getElementById("navMenu")
    this.sections = document.querySelectorAll("section[id]")

    this.currentSection = "home"
    this.isScrolling = false

    this.init()
  }

  init() {
    this.bindEvents()
    this.updateActiveSection()
  }

  bindEvents() {
    // Navigation link clicks
    this.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const targetId = link.getAttribute("href").substring(1)
        const targetSection = document.getElementById(targetId)

        if (targetSection) {
          this.scrollToSection(targetSection)
          this.setActiveLink(link)
        }
      })
    })

    // Mobile menu toggle
    this.menuToggle?.addEventListener("click", () => {
      this.toggleMobileMenu()
    })

    // Scroll spy
    window.addEventListener(
      "scroll",
      Utils.throttle(() => {
        this.updateActiveSection()
        this.updateNavBackground()
      }, CONFIG.THROTTLE_DELAY),
    )

    // Close mobile menu on outside click
    document.addEventListener("click", (e) => {
      if (!this.nav.contains(e.target) && this.navMenu.classList.contains("active")) {
        this.closeMobileMenu()
      }
    })
  }

  scrollToSection(section) {
    this.isScrolling = true
    Utils.smoothScrollTo(section, 80)

    setTimeout(() => {
      this.isScrolling = false
    }, 800)
  }

  setActiveLink(activeLink) {
    this.navLinks.forEach((link) => link.classList.remove("active"))
    activeLink.classList.add("active")
  }

  updateActiveSection() {
    if (this.isScrolling) return

    const scrollPosition = window.scrollY + 100

    this.sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight
      const sectionId = section.getAttribute("id")

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        if (this.currentSection !== sectionId) {
          this.currentSection = sectionId

          // Update active nav link
          const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`)
          if (activeLink) {
            this.setActiveLink(activeLink)
          }
        }
      }
    })
  }

  updateNavBackground() {
    const scrolled = window.scrollY > 50
    this.nav.style.background = scrolled ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.1)"
    this.nav.style.backdropFilter = scrolled ? "blur(20px)" : "blur(10px)"
  }

  toggleMobileMenu() {
    this.navMenu.classList.toggle("active")
    this.menuToggle.classList.toggle("active")

    // Animate hamburger lines
    const lines = this.menuToggle.querySelectorAll(".hamburger-line")
    lines.forEach((line, index) => {
      if (this.menuToggle.classList.contains("active")) {
        if (index === 0) line.style.transform = "rotate(45deg) translate(5px, 5px)"
        if (index === 1) line.style.opacity = "0"
        if (index === 2) line.style.transform = "rotate(-45deg) translate(7px, -6px)"
      } else {
        line.style.transform = ""
        line.style.opacity = ""
      }
    })
  }

  closeMobileMenu() {
    this.navMenu.classList.remove("active")
    this.menuToggle.classList.remove("active")

    const lines = this.menuToggle.querySelectorAll(".hamburger-line")
    lines.forEach((line) => {
      line.style.transform = ""
      line.style.opacity = ""
    })
  }
}

// Typing Animation Manager
class TypingAnimation {
  constructor(element, texts, options = {}) {
    this.element = element
    this.texts = texts
    this.options = {
      typeSpeed: options.typeSpeed || CONFIG.TYPING_SPEED,
      deleteSpeed: options.deleteSpeed || 50,
      delayBetween: options.delayBetween || CONFIG.TYPING_DELAY,
      loop: options.loop !== false,
      cursor: options.cursor !== false,
    }

    this.currentTextIndex = 0
    this.currentCharIndex = 0
    this.isDeleting = false
    this.isWaiting = false

    this.init()
  }

  init() {
    if (this.options.cursor) {
      this.element.style.borderRight = "2px solid"
      this.element.style.animation = "cursorBlink 1s infinite"
    }

    this.type()
  }

  type() {
    const currentText = this.texts[this.currentTextIndex]

    if (this.isWaiting) {
      setTimeout(() => {
        this.isWaiting = false
        this.type()
      }, this.options.delayBetween)
      return
    }

    if (!this.isDeleting) {
      // Typing
      if (this.currentCharIndex < currentText.length) {
        this.element.textContent = currentText.substring(0, this.currentCharIndex + 1)
        this.currentCharIndex++
        setTimeout(() => this.type(), this.options.typeSpeed)
      } else {
        // Finished typing, wait then start deleting
        this.isWaiting = true
        this.isDeleting = true
      }
    } else {
      // Deleting
      if (this.currentCharIndex > 0) {
        this.element.textContent = currentText.substring(0, this.currentCharIndex - 1)
        this.currentCharIndex--
        setTimeout(() => this.type(), this.options.deleteSpeed)
      } else {
        // Finished deleting, move to next text
        this.isDeleting = false
        this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length

        if (this.options.loop || this.currentTextIndex !== 0) {
          setTimeout(() => this.type(), this.options.typeSpeed)
        }
      }
    }
  }
}

// Intersection Observer Manager
class IntersectionManager {
  constructor() {
    this.observers = new Map()
    this.init()
  }

  init() {
    this.setupAnimationObserver()
    this.setupCounterObserver()
    this.setupProgressBarObserver()
    this.setupSkillLevelObserver()
  }

  setupAnimationObserver() {
    const animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    // Observe elements that need animation
    const animatedElements = document.querySelectorAll(
      [
        ".stat-item",
        ".text-card",
        ".spec-card",
        ".timeline-card",
        ".project-card",
        ".achievement-card",
        ".skill-category",
        ".contact-method",
      ].join(", "),
    )

    animatedElements.forEach((el) => animationObserver.observe(el))
    this.observers.set("animation", animationObserver)
  }

  setupCounterObserver() {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.classList.contains("counted")) {
            entry.target.classList.add("counted")
            const target = Number.parseFloat(entry.target.dataset.target)
            Utils.animateNumber(entry.target, 0, target)
          }
        })
      },
      { threshold: 0.5 },
    )

    const counters = document.querySelectorAll(".stat-number[data-target]")
    counters.forEach((counter) => counterObserver.observe(counter))
    this.observers.set("counter", counterObserver)
  }

  setupProgressBarObserver() {
    const progressObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.classList.contains("animated")) {
            entry.target.classList.add("animated")
            const progress = entry.target.dataset.progress
            entry.target.style.width = `${progress}%`
          }
        })
      },
      { threshold: 0.5 },
    )

    const progressBars = document.querySelectorAll(".stat-progress[data-progress]")
    progressBars.forEach((bar) => progressObserver.observe(bar))
    this.observers.set("progress", progressObserver)
  }

  setupSkillLevelObserver() {
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.classList.contains("animated")) {
            entry.target.classList.add("animated")
            const level = entry.target.dataset.level
            setTimeout(() => {
              entry.target.style.width = `${level}%`
            }, 500)
          }
        })
      },
      { threshold: 0.3 },
    )

    const skillLevels = document.querySelectorAll(".level-fill[data-level]")
    skillLevels.forEach((skill) => skillObserver.observe(skill))
    this.observers.set("skill", skillObserver)
  }

  destroy() {
    this.observers.forEach((observer) => observer.disconnect())
    this.observers.clear()
  }
}

// Skills Radar Chart
class SkillRadarChart {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.skills = Object.keys(CONFIG.SKILL_LEVELS)
    this.levels = Object.values(CONFIG.SKILL_LEVELS)
    this.center = { x: 200, y: 200 }
    this.radius = 150
    this.animationProgress = 0

    this.init()
  }

  init() {
    this.canvas.width = 400
    this.canvas.height = 400
    this.animate()
  }

  drawGrid() {
    const levels = 5
    const angleStep = (Math.PI * 2) / this.skills.length

    this.ctx.strokeStyle = "rgba(100, 116, 139, 0.2)"
    this.ctx.lineWidth = 1

    // Draw concentric circles
    for (let i = 1; i <= levels; i++) {
      const radius = (this.radius / levels) * i
      this.ctx.beginPath()
      this.ctx.arc(this.center.x, this.center.y, radius, 0, Math.PI * 2)
      this.ctx.stroke()
    }

    // Draw radial lines
    for (let i = 0; i < this.skills.length; i++) {
      const angle = i * angleStep - Math.PI / 2
      const x = this.center.x + Math.cos(angle) * this.radius
      const y = this.center.y + Math.sin(angle) * this.radius

      this.ctx.beginPath()
      this.ctx.moveTo(this.center.x, this.center.y)
      this.ctx.lineTo(x, y)
      this.ctx.stroke()
    }
  }

  drawSkillArea() {
    const angleStep = (Math.PI * 2) / this.skills.length

    this.ctx.fillStyle = "rgba(59, 130, 246, 0.2)"
    this.ctx.strokeStyle = "rgba(59, 130, 246, 0.8)"
    this.ctx.lineWidth = 2

    this.ctx.beginPath()

    for (let i = 0; i < this.skills.length; i++) {
      const angle = i * angleStep - Math.PI / 2
      const level = (this.levels[i] / 100) * this.animationProgress
      const distance = (this.radius * level) / 100
      const x = this.center.x + Math.cos(angle) * distance
      const y = this.center.y + Math.sin(angle) * distance

      if (i === 0) {
        this.ctx.moveTo(x, y)
      } else {
        this.ctx.lineTo(x, y)
      }
    }

    this.ctx.closePath()
    this.ctx.fill()
    this.ctx.stroke()

    // Draw skill points
    this.ctx.fillStyle = "rgba(59, 130, 246, 1)"
    for (let i = 0; i < this.skills.length; i++) {
      const angle = i * angleStep - Math.PI / 2
      const level = (this.levels[i] / 100) * this.animationProgress
      const distance = (this.radius * level) / 100
      const x = this.center.x + Math.cos(angle) * distance
      const y = this.center.y + Math.sin(angle) * distance

      this.ctx.beginPath()
      this.ctx.arc(x, y, 4, 0, Math.PI * 2)
      this.ctx.fill()
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.drawGrid()
    this.drawSkillArea()

    if (this.animationProgress < 100) {
      this.animationProgress += 2
      requestAnimationFrame(() => this.animate())
    }
  }
}

// Contact Form Manager
class ContactFormManager {
  constructor() {
    this.form = document.getElementById("contactForm")
    this.inputs = this.form?.querySelectorAll("input, select, textarea")

    if (this.form) {
      this.init()
    }
  }

  init() {
    this.bindEvents()
    this.setupValidation()
  }

  bindEvents() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleSubmit()
    })

    // Add focus/blur effects to form inputs
    this.inputs?.forEach((input) => {
      input.addEventListener("focus", (e) => {
        this.handleInputFocus(e.target)
      })

      input.addEventListener("blur", (e) => {
        this.handleInputBlur(e.target)
      })

      input.addEventListener(
        "input",
        Utils.debounce((e) => {
          this.validateField(e.target)
        }, CONFIG.FORM_VALIDATION_DELAY),
      )
    })
  }

  handleInputFocus(input) {
    const formGroup = input.closest(".form-group")
    formGroup?.classList.add("focused")
  }

  handleInputBlur(input) {
    const formGroup = input.closest(".form-group")
    if (!input.value) {
      formGroup?.classList.remove("focused")
    }
  }

  validateField(field) {
    const formGroup = field.closest(".form-group")
    let isValid = true
    let errorMessage = ""

    // Remove existing error
    const existingError = formGroup.querySelector(".error-message")
    if (existingError) {
      existingError.remove()
    }

    // Validate based on field type
    switch (field.type) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (field.value && !emailRegex.test(field.value)) {
          isValid = false
          errorMessage = "Please enter a valid email address"
        }
        break

      case "tel":
        const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
        if (field.value && !phoneRegex.test(field.value.replace(/\s/g, ""))) {
          isValid = false
          errorMessage = "Please enter a valid phone number"
        }
        break

      default:
        if (field.required && !field.value.trim()) {
          isValid = false
          errorMessage = "This field is required"
        }
    }

    // Update field appearance
    if (isValid) {
      formGroup.classList.remove("error")
      formGroup.classList.add("valid")
    } else {
      formGroup.classList.remove("valid")
      formGroup.classList.add("error")

      // Add error message
      const errorDiv = document.createElement("div")
      errorDiv.className = "error-message"
      errorDiv.textContent = errorMessage
      formGroup.appendChild(errorDiv)
    }

    return isValid
  }

  validateForm() {
    let isValid = true

    this.inputs.forEach((input) => {
      if (!this.validateField(input)) {
        isValid = false
      }
    })

    return isValid
  }

  async handleSubmit() {
    if (!this.validateForm()) {
      this.showNotification("Please fix the errors in the form", "error")
      return
    }

    const submitButton = this.form.querySelector('button[type="submit"]')
    const originalText = submitButton.querySelector(".btn-text").textContent

    // Show loading state
    submitButton.disabled = true
    submitButton.querySelector(".btn-text").textContent = "Sending..."
    submitButton.querySelector(".btn-icon").className = "fas fa-spinner fa-spin btn-icon"

    try {
      // Simulate form submission (replace with actual API call)
      await this.simulateFormSubmission()

      this.showNotification("Message sent successfully! I'll get back to you soon.", "success")
      this.form.reset()

      // Remove validation classes
      this.inputs.forEach((input) => {
        const formGroup = input.closest(".form-group")
        formGroup.classList.remove("focused", "valid", "error")
      })
    } catch (error) {
      this.showNotification("Failed to send message. Please try again.", "error")
    } finally {
      // Reset button state
      submitButton.disabled = false
      submitButton.querySelector(".btn-text").textContent = originalText
      submitButton.querySelector(".btn-icon").className = "fas fa-paper-plane btn-icon"
    }
  }

  simulateFormSubmission() {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000)
    })
  }

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `

    // Add styles
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === "success" ? "var(--accent-green)" : type === "error" ? "var(--accent-pink)" : "var(--primary-600)"};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `

    document.body.appendChild(notification)

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100)

    // Handle close button
    const closeBtn = notification.querySelector(".notification-close")
    closeBtn.addEventListener("click", () => {
      this.hideNotification(notification)
    })

    // Auto hide after 5 seconds
    setTimeout(() => {
      this.hideNotification(notification)
    }, 5000)
  }

  hideNotification(notification) {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      notification.remove()
    }, 300)
  }

  setupValidation() {
    // Add CSS for validation states
    const style = document.createElement("style")
    style.textContent = `
            .form-group.error input,
            .form-group.error select,
            .form-group.error textarea {
                border-color: var(--accent-pink);
                box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
            }
            
            .form-group.valid input,
            .form-group.valid select,
            .form-group.valid textarea {
                border-color: var(--accent-green);
                box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
            }
            
            .error-message {
                color: var(--accent-pink);
                font-size: 0.8rem;
                margin-top: 0.5rem;
                font-weight: 500;
            }
            
            .notification {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 4px;
                transition: background-color 0.2s;
            }
            
            .notification-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
        `
    document.head.appendChild(style)
  }
}

// Performance Monitor
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: 0,
      memory: 0,
      loadTime: 0,
    }

    this.frameCount = 0
    this.lastTime = performance.now()

    this.init()
  }

  init() {
    this.measureLoadTime()
    this.startFPSMonitoring()
    this.monitorMemory()
  }

  measureLoadTime() {
    window.addEventListener("load", () => {
      this.metrics.loadTime = performance.now()
      console.log(`Portfolio loaded in ${this.metrics.loadTime.toFixed(2)}ms`)
    })
  }

  startFPSMonitoring() {
    const measureFPS = () => {
      this.frameCount++
      const currentTime = performance.now()

      if (currentTime >= this.lastTime + 1000) {
        this.metrics.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime))
        this.frameCount = 0
        this.lastTime = currentTime
      }

      requestAnimationFrame(measureFPS)
    }

    measureFPS()
  }

  monitorMemory() {
    if ("memory" in performance) {
      setInterval(() => {
        this.metrics.memory = Math.round(performance.memory.usedJSHeapSize / 1048576)
      }, 5000)
    }
  }

  getMetrics() {
    return this.metrics
  }

  logMetrics() {
    console.table(this.metrics)
  }
}

// Main Portfolio Application
class PortfolioApp {
  constructor() {
    this.components = {}
    this.isInitialized = false

    this.init()
  }

  init() {
    try {
      this.initializeComponents()
      this.setupGlobalEvents()
      this.setupRippleEffects()
      this.setupMagneticEffects()
      this.initializeTypingAnimation()
      this.initializeSkillRadar()
      this.setupDownloadCV()

      this.isInitialized = true
      console.log("Portfolio application initialized successfully")
    } catch (error) {
      console.error("Error initializing portfolio:", error)
    }
  }

  initializeComponents() {
    // Initialize theme manager
    this.components.themeManager = new ThemeManager()

    // Initialize cursor manager
    this.components.cursorManager = new CursorManager()

    // Initialize navigation
    this.components.navigationManager = new NavigationManager()

    // Initialize intersection observer
    this.components.intersectionManager = new IntersectionManager()

    // Initialize contact form
    this.components.contactFormManager = new ContactFormManager()

    // Initialize particle system
    const particleCanvas = document.querySelector(".particle-canvas")
    if (particleCanvas) {
      this.components.particleSystem = new ParticleSystem(particleCanvas)
    }

    // Initialize performance monitor
    this.components.performanceMonitor = new PerformanceMonitor()
  }

  setupGlobalEvents() {
    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // Toggle theme with Ctrl/Cmd + D
      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault()
        this.components.themeManager.toggleTheme()
      }

      // Show performance metrics with Ctrl/Cmd + P
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault()
        this.components.performanceMonitor.logMetrics()
      }
    })

    // Handle window resize
    window.addEventListener(
      "resize",
      Utils.debounce(() => {
        this.handleResize()
      }, CONFIG.DEBOUNCE_DELAY),
    )

    // Handle visibility change
    document.addEventListener("visibilitychange", () => {
      this.handleVisibilityChange()
    })
  }

  setupRippleEffects() {
    const rippleElements = document.querySelectorAll(".btn, .nav-link, .social-link, .project-btn")

    rippleElements.forEach((element) => {
      element.addEventListener("click", (e) => {
        Utils.createRipple(e, element)
      })
    })
  }

  setupMagneticEffects() {
    const magneticElements = document.querySelectorAll(".btn-primary, .social-link, .logo-container")

    magneticElements.forEach((element) => {
      element.addEventListener("mousemove", (e) => {
        const rect = element.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2

        const distance = Math.sqrt(x * x + y * y)
        const maxDistance = 50

        if (distance < maxDistance) {
          const strength = (maxDistance - distance) / maxDistance
          const moveX = x * strength * 0.3
          const moveY = y * strength * 0.3

          element.style.transform = `translate(${moveX}px, ${moveY}px)`
        }
      })

      element.addEventListener("mouseleave", () => {
        element.style.transform = ""
      })
    })
  }

  initializeTypingAnimation() {
    const typingElement = document.getElementById("typingText")
    if (typingElement) {
      const roles = [
        "Information Systems Student",
        "AI/ML Engineer",
        "Data Science Enthusiast",
        "Full-Stack Developer",
        "Mobile App Developer",
        "Problem Solver",
        "Innovation Seeker",
      ]

      new TypingAnimation(typingElement, roles, {
        typeSpeed: 80,
        deleteSpeed: 40,
        delayBetween: 2000,
      })
    }
  }

  initializeSkillRadar() {
    const radarCanvas = document.querySelector("#skillRadar canvas")
    if (radarCanvas) {
      // Initialize radar chart when it comes into view
      const radarObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !entry.target.classList.contains("initialized")) {
              entry.target.classList.add("initialized")
              new SkillRadarChart(entry.target)
            }
          })
        },
        { threshold: 0.3 },
      )

      radarObserver.observe(radarCanvas)
    }
  }

  setupDownloadCV() {
    const downloadButtons = document.querySelectorAll('[onclick="downloadCV()"]')
    downloadButtons.forEach((button) => {
      button.removeAttribute("onclick")
      button.addEventListener("click", (e) => {
        e.preventDefault()
        this.downloadCV()
      })
    })
  }

  downloadCV() {
    // Create a temporary link element
    const link = document.createElement("a")
    link.href = "/placeholder.svg?height=800&width=600" // Replace with actual CV file path
    link.download = "Reinaldy_Hutapea_CV.pdf"
    link.style.display = "none"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Show notification
    if (this.components.contactFormManager) {
      this.components.contactFormManager.showNotification("CV download started!", "success")
    }
  }

  handleResize() {
    // Update particle system
    if (this.components.particleSystem) {
      this.components.particleSystem.resizeCanvas()
    }

    // Update any other components that need resize handling
    console.log("Window resized, updating components...")
  }

  handleVisibilityChange() {
    if (document.hidden) {
      // Pause animations when tab is not visible
      this.pauseAnimations()
    } else {
      // Resume animations when tab becomes visible
      this.resumeAnimations()
    }
  }

  pauseAnimations() {
    // Pause particle system
    if (this.components.particleSystem) {
      this.components.particleSystem.destroy()
    }
  }

  resumeAnimations() {
    // Resume particle system
    const particleCanvas = document.querySelector(".particle-canvas")
    if (particleCanvas && !this.components.particleSystem) {
      this.components.particleSystem = new ParticleSystem(particleCanvas)
    }
  }

  destroy() {
    // Clean up all components
    Object.values(this.components).forEach((component) => {
      if (component && typeof component.destroy === "function") {
        component.destroy()
      }
    })

    this.components = {}
    this.isInitialized = false
  }
}

// Global functions for backward compatibility
window.downloadCV = () => {
  if (window.portfolioApp && window.portfolioApp.downloadCV) {
    window.portfolioApp.downloadCV()
  }
}

// Initialize application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Start with loading screen
  new LoadingManager()
})

// Handle page unload
window.addEventListener("beforeunload", () => {
  if (window.portfolioApp) {
    window.portfolioApp.destroy()
  }
})

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PortfolioApp,
    LoadingManager,
    ThemeManager,
    Utils,
    CONFIG,
  }
}

// Service Worker Registration (for PWA capabilities)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}

// Error handling
window.addEventListener("error", (e) => {
  console.error("Global error:", e.error)

  // You could send error reports to a logging service here
  // Example: sendErrorReport(e.error);
})

window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled promise rejection:", e.reason)

  // Prevent the default browser behavior
  e.preventDefault()
})

// Console welcome message
console.log(`
🚀 Welcome to Reinaldy Hutapea's Portfolio!
📧 Contact: reinaldyhutapea@gmail.com
🔗 LinkedIn: linkedin.com/in/reinaldy-hutapea
💻 GitHub: github.com/reinaldy

Built with modern web technologies and lots of ❤️
`)

// Ultra Advanced Portfolio JavaScript
// Reinaldy Hutapea - Information Systems Student

class PortfolioApp {
  constructor() {
    this.isLoaded = false
    this.currentTheme = localStorage.getItem("theme") || "light"
    this.currentSection = "home"
    this.typingRoles = ["Front End Developer", "Mobile Developer", "Machine Learning Engineer"]
    this.currentRoleIndex = 0
    this.isTyping = false

    this.init()
  }

  init() {
    this.setupEventListeners()
    this.initializeTheme()
    this.startLoadingSequence()
    this.initializeCustomCursor()
    this.initializeParticles()
    this.initializeScrollAnimations()
    this.initializeNavigation()
    this.initializeTypingAnimation()
    this.initializeCounters()
    this.initializeSkillBars()
    this.initializeContactForm()
    this.initializeIntersectionObserver()
    this.initializePerformanceMonitoring()
  }

  setupEventListeners() {
    // Theme toggle
    document.getElementById("themeToggle")?.addEventListener("click", () => this.toggleTheme())

    // Menu toggle
    document.getElementById("menuToggle")?.addEventListener("click", () => this.toggleMobileMenu())

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => this.handleSmoothScroll(e))
    })

    // Window events
    window.addEventListener("scroll", () => this.handleScroll())
    window.addEventListener("resize", () => this.handleResize())
    window.addEventListener("load", () => this.handleWindowLoad())

    // Keyboard navigation
    document.addEventListener("keydown", (e) => this.handleKeyboardNavigation(e))

    // Form submission
    document.getElementById("contactForm")?.addEventListener("submit", (e) => this.handleFormSubmit(e))

    // Button ripple effects
    document.querySelectorAll(".btn, .project-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => this.createRippleEffect(e))
    })
  }

  initializeTheme() {
    document.documentElement.setAttribute("data-theme", this.currentTheme)
    this.updateThemeIcon()
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === "light" ? "dark" : "light"
    document.documentElement.setAttribute("data-theme", this.currentTheme)
    localStorage.setItem("theme", this.currentTheme)
    this.updateThemeIcon()

    // Add theme transition effect
    document.body.style.transition = "background-color 0.3s ease, color 0.3s ease"
    setTimeout(() => {
      document.body.style.transition = ""
    }, 300)
  }

  updateThemeIcon() {
    const sunIcon = document.querySelector(".sun-icon")
    const moonIcon = document.querySelector(".moon-icon")

    if (this.currentTheme === "dark") {
      sunIcon?.style.setProperty("opacity", "0")
      moonIcon?.style.setProperty("opacity", "1")
    } else {
      sunIcon?.style.setProperty("opacity", "1")
      moonIcon?.style.setProperty("opacity", "0")
    }
  }

  startLoadingSequence() {
    const loadingScreen = document.getElementById("loadingScreen")
    const progressBar = document.getElementById("progressBar")
    const loadingPercentage = document.getElementById("loadingPercentage")
    const loadingText = document.querySelector(".loading-text")

    if (!loadingScreen || !progressBar || !loadingPercentage) return

    const loadingSteps = [
      { text: "Initializing portfolio...", progress: 20 },
      { text: "Loading components...", progress: 40 },
      { text: "Setting up animations...", progress: 60 },
      { text: "Preparing content...", progress: 80 },
      { text: "Almost ready...", progress: 95 },
      { text: "Welcome!", progress: 100 },
    ]

    let currentStep = 0

    const updateLoading = () => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep]
        loadingText.textContent = step.text
        progressBar.style.width = `${step.progress}%`
        loadingPercentage.textContent = `${step.progress}%`
        currentStep++

        setTimeout(updateLoading, 500)
      } else {
        setTimeout(() => {
          loadingScreen.classList.add("hidden")
          this.isLoaded = true
          this.startMainAnimations()
        }, 500)
      }
    }

    updateLoading()
  }

  startMainAnimations() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 800,
        easing: "ease-out-cubic",
        once: true,
        offset: 100,
      })
    }

    // Start typing animation
    this.startTypingAnimation()

    // Animate hero elements
    this.animateHeroElements()

    // Initialize skill radar chart
    this.initializeSkillRadar()
  }

  initializeCustomCursor() {
    if (window.innerWidth <= 768) return // Skip on mobile

    const cursor = document.createElement("div")
    const cursorDot = document.createElement("div")

    cursor.className = "cursor-follower"
    cursorDot.className = "cursor-dot"

    document.body.appendChild(cursor)
    document.body.appendChild(cursorDot)

    let mouseX = 0,
      mouseY = 0
    let cursorX = 0,
      cursorY = 0
    let dotX = 0,
      dotY = 0

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      cursor.classList.add("active")
      cursorDot.classList.add("active")
    })

    document.addEventListener("mouseleave", () => {
      cursor.classList.remove("active")
      cursorDot.classList.remove("active")
    })

    // Animate cursor
    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.1
      cursorY += (mouseY - cursorY) * 0.1
      dotX += (mouseX - dotX) * 0.8
      dotY += (mouseY - dotY) * 0.8

      cursor.style.left = cursorX + "px"
      cursor.style.top = cursorY + "px"
      cursorDot.style.left = dotX + "px"
      cursorDot.style.top = dotY + "px"

      requestAnimationFrame(animateCursor)
    }
    animateCursor()

    // Hover effects
    document.querySelectorAll("a, button, .btn, .project-card, .skill-item").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("hover"))
      el.addEventListener("mouseleave", () => cursor.classList.remove("hover"))
    })
  }

  initializeParticles() {
    const canvas = document.querySelector(".particle-canvas")
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    let particles = []
    let animationId

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      color: `hsl(${220 + Math.random() * 60}, 70%, 60%)`,
    })

    const initParticles = () => {
      particles = []
      for (let i = 0; i < 50; i++) {
        particles.push(createParticle())
      }
    }

    const updateParticles = () => {
      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        particle.opacity += (Math.random() - 0.5) * 0.01
        particle.opacity = Math.max(0.1, Math.min(0.8, particle.opacity))
      })
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color.replace(")", `, ${particle.opacity})`).replace("hsl", "hsla")
        ctx.fill()
      })

      // Draw connections
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance / 100)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })
    }

    const animate = () => {
      updateParticles()
      drawParticles()
      animationId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    initParticles()
    animate()

    window.addEventListener("resize", () => {
      resizeCanvas()
      initParticles()
    })

    // Pause animation when not visible
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId)
      } else {
        animate()
      }
    })
  }

  initializeScrollAnimations() {
    // Parallax effect for hero section
    const heroSection = document.querySelector(".hero-section")
    const profileCard = document.querySelector(".profile-card")

    if (heroSection && profileCard) {
      window.addEventListener("scroll", () => {
        const scrolled = window.pageYOffset
        const rate = scrolled * -0.5
        profileCard.style.transform = `translateY(${rate}px)`
      })
    }

    // Navbar background on scroll
    const navbar = document.querySelector(".main-nav")
    if (navbar) {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 100) {
          navbar.style.background = "rgba(255, 255, 255, 0.95)"
          navbar.style.backdropFilter = "blur(20px)"
          navbar.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
        } else {
          navbar.style.background = "rgba(255, 255, 255, 0.1)"
          navbar.style.backdropFilter = "blur(20px)"
          navbar.style.boxShadow = "none"
        }
      })
    }
  }

  initializeNavigation() {
    const navLinks = document.querySelectorAll(".nav-link")
    const sections = document.querySelectorAll("section[id]")

    const updateActiveNavLink = () => {
      const scrollPos = window.scrollY + 100

      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight
        const sectionId = section.getAttribute("id")

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          navLinks.forEach((link) => {
            link.classList.remove("active")
            if (link.getAttribute("data-section") === sectionId) {
              link.classList.add("active")
              this.currentSection = sectionId
            }
          })
        }
      })
    }

    window.addEventListener("scroll", updateActiveNavLink)
    updateActiveNavLink() // Initial call
  }

  initializeTypingAnimation() {
    const typingElement = document.getElementById("typingText")
    if (!typingElement) return

    const typeText = async (text) => {
      typingElement.textContent = ""
      for (let i = 0; i < text.length; i++) {
        typingElement.textContent += text[i]
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }

    const deleteText = async () => {
      const currentText = typingElement.textContent
      for (let i = currentText.length; i >= 0; i--) {
        typingElement.textContent = currentText.substring(0, i)
        await new Promise((resolve) => setTimeout(resolve, 50))
      }
    }

    const startTypingAnimation = async () => {
      while (true) {
        for (const role of this.typingRoles) {
          await typeText(role)
          await new Promise((resolve) => setTimeout(resolve, 2000))
          await deleteText()
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      }
    }

    startTypingAnimation()
  }

  startTypingAnimation() {
    // This method is called after loading is complete
    if (!this.isTyping) {
      this.isTyping = true
      this.initializeTypingAnimation()
    }
  }

  animateHeroElements() {
    // Animate hero stats
    const statItems = document.querySelectorAll(".stat-item")
    statItems.forEach((item, index) => {
      setTimeout(() => {
        item.style.opacity = "1"
        item.style.transform = "translateY(0)"
      }, index * 200)
    })

    // Animate floating icons
    const floatingIcons = document.querySelectorAll(".floating-icon")
    floatingIcons.forEach((icon, index) => {
      setTimeout(() => {
        icon.style.opacity = "1"
        icon.style.animation = `iconFloat 4s ease-in-out infinite ${index}s`
      }, index * 300)
    })
  }

  initializeCounters() {
    const counters = document.querySelectorAll(".stat-number[data-target]")

    const animateCounter = (counter) => {
      const target = Number.parseInt(counter.getAttribute("data-target"))
      const duration = 2000
      const step = target / (duration / 16)
      let current = 0

      const updateCounter = () => {
        current += step
        if (current < target) {
          counter.textContent = Math.floor(current)
          requestAnimationFrame(updateCounter)
        } else {
          counter.textContent = target
        }
      }

      updateCounter()
    }

    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target)
          counterObserver.unobserve(entry.target)
        }
      })
    })

    counters.forEach((counter) => counterObserver.observe(counter))
  }

  initializeSkillBars() {
    const skillBars = document.querySelectorAll(".level-fill[data-level]")

    const animateSkillBar = (bar) => {
      const level = bar.getAttribute("data-level")
      setTimeout(() => {
        bar.style.width = `${level}%`
      }, 500)
    }

    // Intersection Observer for skill bars
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateSkillBar(entry.target)
          skillObserver.unobserve(entry.target)
        }
      })
    })

    skillBars.forEach((bar) => skillObserver.observe(bar))

    // Animate progress bars with custom progress values
    const progressBars = document.querySelectorAll(".stat-progress[data-progress]")
    progressBars.forEach((bar) => {
      const progress = bar.getAttribute("data-progress")
      bar.style.setProperty("--progress-width", `${progress}%`)
    })
  }

  initializeSkillRadar() {
    const canvas = document.querySelector("#skillRadar canvas")
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = 150

    const skills = [
      { name: "Python", level: 0.9 },
      { name: "Java", level: 0.85 },
      { name: "Flutter", level: 0.85 },
      { name: "ML/AI", level: 0.8 },
      { name: "Data Science", level: 0.9 },
      { name: "Web Dev", level: 0.8 },
      { name: "Mobile Dev", level: 0.85 },
      { name: "Database", level: 0.8 },
    ]

    const drawRadarChart = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath()
        ctx.arc(centerX, centerY, (radius / 5) * i, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(59, 130, 246, 0.2)"
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Draw axes
      skills.forEach((_, index) => {
        const angle = (index * Math.PI * 2) / skills.length - Math.PI / 2
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(x, y)
        ctx.strokeStyle = "rgba(59, 130, 246, 0.2)"
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // Draw skill polygon
      ctx.beginPath()
      skills.forEach((skill, index) => {
        const angle = (index * Math.PI * 2) / skills.length - Math.PI / 2
        const distance = skill.level * radius
        const x = centerX + Math.cos(angle) * distance
        const y = centerY + Math.sin(angle) * distance

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.closePath()
      ctx.fillStyle = "rgba(59, 130, 246, 0.2)"
      ctx.fill()
      ctx.strokeStyle = "rgba(59, 130, 246, 0.8)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw skill points
      skills.forEach((skill, index) => {
        const angle = (index * Math.PI * 2) / skills.length - Math.PI / 2
        const distance = skill.level * radius
        const x = centerX + Math.cos(angle) * distance
        const y = centerY + Math.sin(angle) * distance

        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = "#3b82f6"
        ctx.fill()
      })
    }

    // Animate radar chart
    let animationProgress = 0
    const animateRadar = () => {
      if (animationProgress < 1) {
        animationProgress += 0.02
        skills.forEach((skill) => {
          skill.currentLevel = (skill.currentLevel || 0) + (skill.level - (skill.currentLevel || 0)) * 0.1
        })
        drawRadarChart()
        requestAnimationFrame(animateRadar)
      }
    }

    // Start animation when visible
    const radarObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateRadar()
          radarObserver.unobserve(entry.target)
        }
      })
    })

    radarObserver.observe(canvas)
  }

  initializeContactForm() {
    const form = document.getElementById("contactForm")
    if (!form) return

    // Form validation
    const validateForm = (formData) => {
      const errors = {}

      if (!formData.get("name")?.trim()) {
        errors.name = "Name is required"
      }

      if (!formData.get("email")?.trim()) {
        errors.email = "Email is required"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.get("email"))) {
        errors.email = "Please enter a valid email address"
      }

      if (!formData.get("subject")?.trim()) {
        errors.subject = "Subject is required"
      }

      if (!formData.get("message")?.trim()) {
        errors.message = "Message is required"
      }

      return errors
    }

    // Show form errors
    const showErrors = (errors) => {
      // Clear previous errors
      document.querySelectorAll(".form-error").forEach((error) => error.remove())

      Object.keys(errors).forEach((field) => {
        const input = form.querySelector(`[name="${field}"]`)
        if (input) {
          const error = document.createElement("div")
          error.className = "form-error"
          error.style.color = "#ef4444"
          error.style.fontSize = "0.875rem"
          error.style.marginTop = "0.25rem"
          error.textContent = errors[field]
          input.parentNode.appendChild(error)
          input.style.borderColor = "#ef4444"
        }
      })
    }

    // Clear form errors
    const clearErrors = () => {
      document.querySelectorAll(".form-error").forEach((error) => error.remove())
      form.querySelectorAll("input, select, textarea").forEach((input) => {
        input.style.borderColor = ""
      })
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault()

      const formData = new FormData(form)
      const errors = validateForm(formData)

      if (Object.keys(errors).length > 0) {
        showErrors(errors)
        return
      }

      clearErrors()

      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]')
      const originalText = submitBtn.innerHTML
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'
      submitBtn.disabled = true

      try {
        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Show success message
        this.showNotification("Message sent successfully! I'll get back to you soon.", "success")
        form.reset()
      } catch (error) {
        this.showNotification("Failed to send message. Please try again.", "error")
      } finally {
        submitBtn.innerHTML = originalText
        submitBtn.disabled = false
      }
    })

    // Real-time validation
    form.querySelectorAll("input, select, textarea").forEach((input) => {
      input.addEventListener("blur", () => {
        const formData = new FormData(form)
        const errors = validateForm(formData)

        if (errors[input.name]) {
          input.style.borderColor = "#ef4444"
        } else {
          input.style.borderColor = "#10b981"
        }
      })

      input.addEventListener("focus", () => {
        input.style.borderColor = "#3b82f6"
      })
    })
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6"};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 400px;
    `

    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; margin-left: auto; cursor: pointer;">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `

    document.body.appendChild(notification)

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100)

    // Auto remove
    setTimeout(() => {
      notification.style.transform = "translateX(100%)"
      setTimeout(() => notification.remove(), 300)
    }, 5000)
  }

  handleSmoothScroll(e) {
    e.preventDefault()
    const targetId = e.currentTarget.getAttribute("href")
    const targetSection = document.querySelector(targetId)

    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 80 // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  }

  handleScroll() {
    // Throttle scroll events
    if (!this.scrollTimeout) {
      this.scrollTimeout = setTimeout(() => {
        this.updateScrollProgress()
        this.scrollTimeout = null
      }, 16) // ~60fps
    }
  }

  updateScrollProgress() {
    const scrollTop = window.pageYOffset
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercent = (scrollTop / docHeight) * 100

    // Update scroll progress indicator if it exists
    const progressIndicator = document.querySelector(".scroll-progress")
    if (progressIndicator) {
      progressIndicator.style.width = `${scrollPercent}%`
    }
  }

  handleResize() {
    // Debounce resize events
    clearTimeout(this.resizeTimeout)
    this.resizeTimeout = setTimeout(() => {
      this.updateLayoutForScreenSize()
    }, 250)
  }

  updateLayoutForScreenSize() {
    const isMobile = window.innerWidth <= 768

    // Update navigation for mobile
    const navMenu = document.getElementById("navMenu")
    if (navMenu) {
      if (isMobile) {
        navMenu.style.display = "none"
      } else {
        navMenu.style.display = "flex"
      }
    }

    // Update particle count for performance
    if (this.particleSystem) {
      this.particleSystem.updateParticleCount(isMobile ? 25 : 50)
    }
  }

  handleWindowLoad() {
    // Optimize images
    this.optimizeImages()

    // Initialize service worker
    this.initializeServiceWorker()

    // Start performance monitoring
    this.startPerformanceMonitoring()
  }

  optimizeImages() {
    const images = document.querySelectorAll("img[data-src]")

    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target
            img.src = img.dataset.src
            img.removeAttribute("data-src")
            imageObserver.unobserve(img)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    images.forEach((img) => imageObserver.observe(img))
  }

  initializeServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered:", registration)
        })
        .catch((error) => {
          console.log("SW registration failed:", error)
        })
    }
  }

  handleKeyboardNavigation(e) {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "k":
          e.preventDefault()
          // Focus search or navigation
          document.querySelector(".nav-menu a")?.focus()
          break
        case "d":
          e.preventDefault()
          this.toggleTheme()
          break
      }
    }

    // Handle escape key
    if (e.key === "Escape") {
      // Close any open modals or menus
      this.closeMobileMenu()
    }
  }

  toggleMobileMenu() {
    const navMenu = document.getElementById("navMenu")
    const menuToggle = document.getElementById("menuToggle")

    if (navMenu && menuToggle) {
      const isOpen = navMenu.style.display === "flex"

      if (isOpen) {
        navMenu.style.display = "none"
        menuToggle.classList.remove("active")
      } else {
        navMenu.style.display = "flex"
        menuToggle.classList.add("active")
      }
    }
  }

  closeMobileMenu() {
    const navMenu = document.getElementById("navMenu")
    const menuToggle = document.getElementById("menuToggle")

    if (navMenu && menuToggle) {
      navMenu.style.display = "none"
      menuToggle.classList.remove("active")
    }
  }

  createRippleEffect(e) {
    const button = e.currentTarget
    const ripple = button.querySelector(".btn-ripple")

    if (ripple) {
      const rect = button.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = size + "px"
      ripple.style.left = x + "px"
      ripple.style.top = y + "px"

      ripple.classList.add("active")

      setTimeout(() => {
        ripple.classList.remove("active")
      }, 600)
    }
  }

  initializeIntersectionObserver() {
    // Animate elements when they come into view
    const animateOnScroll = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
            animateOnScroll.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    // Observe elements that should animate on scroll
    document
      .querySelectorAll(".text-card, .spec-card, .timeline-card, .project-card, .achievement-card")
      .forEach((el) => {
        animateOnScroll.observe(el)
      })
  }

  initializePerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ("web-vital" in window) {
      // This would integrate with a real performance monitoring service
      console.log("Performance monitoring initialized")
    }

    // Monitor memory usage
    if (performance.memory) {
      setInterval(() => {
        const memoryInfo = performance.memory
        if (memoryInfo.usedJSHeapSize > memoryInfo.jsHeapSizeLimit * 0.9) {
          console.warn("High memory usage detected")
          this.optimizePerformance()
        }
      }, 30000)
    }
  }

  startPerformanceMonitoring() {
    // Log performance metrics
    window.addEventListener("load", () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType("navigation")[0]
        console.log("Page Load Time:", perfData.loadEventEnd - perfData.fetchStart, "ms")

        // Log largest contentful paint
        if ("PerformanceObserver" in window) {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const lastEntry = entries[entries.length - 1]
            console.log("LCP:", lastEntry.startTime, "ms")
          })
          observer.observe({ entryTypes: ["largest-contentful-paint"] })
        }
      }, 0)
    })
  }

  optimizePerformance() {
    // Reduce particle count
    if (this.particleSystem) {
      this.particleSystem.reduceParticles()
    }

    // Pause non-essential animations
    document.querySelectorAll(".floating-icon, .shape").forEach((el) => {
      el.style.animationPlayState = "paused"
    })

    // Re-enable after a delay
    setTimeout(() => {
      document.querySelectorAll(".floating-icon, .shape").forEach((el) => {
        el.style.animationPlayState = "running"
      })
    }, 5000)
  }

  handleFormSubmit(e) {
    e.preventDefault()
    // Form submission is handled in initializeContactForm
  }
}

// Utility Functions
function downloadCV() {
  // Create a temporary link to download CV
  const link = document.createElement("a")
  link.href = "/assets/cv/Reinaldy_Hutapea_CV.pdf" // Update with actual CV path
  link.download = "Reinaldy_Hutapea_CV.pdf"
  link.click()

  // Track download event
  if (typeof gtag !== "undefined") {
    gtag("event", "download", {
      event_category: "CV",
      event_label: "CV Download",
    })
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.portfolioApp = new PortfolioApp()
})

// Handle page visibility changes for performance
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // Pause animations and reduce activity when page is not visible
    document.querySelectorAll("*").forEach((el) => {
      if (el.style.animationPlayState !== undefined) {
        el.style.animationPlayState = "paused"
      }
    })
  } else {
    // Resume animations when page becomes visible
    document.querySelectorAll("*").forEach((el) => {
      if (el.style.animationPlayState !== undefined) {
        el.style.animationPlayState = "running"
      }
    })
  }
})

// Error handling
window.addEventListener("error", (e) => {
  console.error("JavaScript Error:", e.error)
  // In production, you might want to send this to an error tracking service
})

// Unhandled promise rejection handling
window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled Promise Rejection:", e.reason)
  e.preventDefault()
})

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = PortfolioApp
}
