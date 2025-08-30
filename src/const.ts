export const handlebarCode = `<!DOCTYPE html>
<html>

<head>
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      color: #333;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }

    .brochure-container {
      max-width: 800px;
      margin: 0 auto;
      background-color: #fff;
    }

    .section {
      padding: 40px;
    }

    .hero-section {
      background-color: #2c5282;
      color: #fff;
      text-align: center;
      padding: 60px 40px;
    }

    .company-logo {
      margin-bottom: 30px;
    }

    .logo-placeholder {
      display: inline-block;
      width: 200px;
      height: 60px;
      background-color: rgba(255, 255, 255, 0.2);
      line-height: 60px;
      text-align: center;
      color: #fff;
      font-size: 16px;
    }

    .hero-title {
      font-size: 36px;
      font-weight: bold;
      margin-bottom: 15px;
    }

    .hero-subtitle {
      font-size: 18px;
      margin-bottom: 30px;
      font-weight: 300;
    }

    .cta-button {
      display: inline-block;
      background-color: #fff;
      color: #2c5282;
      padding: 12px 30px;
      text-decoration: none;
      font-weight: bold;
      border-radius: 4px;
      font-size: 16px;
    }

    .section-title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #2c5282;
    }

    .section-subtitle {
      font-size: 18px;
      margin-bottom: 30px;
      color: #4a5568;
    }

    .feature-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 30px;
      margin-bottom: 20px;
    }

    .feature-item {
      flex: 1;
      min-width: 200px;
      text-align: center;
    }

    .feature-icon {
      width: 80px;
      height: 80px;
      background-color: #ebf8ff;
      border-radius: 50%;
      margin: 0 auto 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #2c5282;
      font-size: 14px;
    }

    .feature-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #2c5282;
    }

    .feature-description {
      font-size: 14px;
      color: #4a5568;
    }

    .about-section {
      background-color: #f7fafc;
      display: flex;
      flex-wrap: wrap;
      gap: 40px;
    }

    .about-content {
      flex: 2;
      min-width: 300px;
    }

    .about-image {
      flex: 1;
      min-width: 200px;
    }

    .image-placeholder {
      width: 100%;
      height: 100%;
      min-height: 250px;
      background-color: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4a5568;
      font-size: 14px;
    }

    .testimonial-section {
      background-color: #2c5282;
      color: #fff;
      text-align: center;
      padding: 60px 40px;
    }

    .testimonial-quote {
      font-size: 24px;
      font-style: italic;
      margin-bottom: 20px;
      line-height: 1.4;
      max-width: 80%;
      margin-left: auto;
      margin-right: auto;
    }

    .testimonial-author {
      font-size: 18px;
      font-weight: bold;
    }

    .testimonial-company {
      font-size: 16px;
      opacity: 0.8;
    }

    .product-section {
      text-align: center;
    }

    .product-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 30px;
      margin-bottom: 30px;
    }

    .product-item {
      flex: 1;
      min-width: 200px;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
    }

    .product-image {
      width: 100%;
      height: 200px;
      background-color: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4a5568;
      font-size: 14px;
    }

    .product-details {
      padding: 20px;
    }

    .product-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #2c5282;
    }

    .product-description {
      font-size: 14px;
      color: #4a5568;
      margin-bottom: 15px;
    }

    .product-price {
      font-size: 18px;
      font-weight: bold;
      color: #2c5282;
      margin-bottom: 15px;
    }

    .product-button {
      display: inline-block;
      background-color: #2c5282;
      color: #fff;
      padding: 8px 20px;
      text-decoration: none;
      border-radius: 4px;
      font-size: 14px;
    }

    .contact-section {
      background-color: #f7fafc;
      text-align: center;
    }

    .contact-methods {
      display: flex;
      flex-wrap: wrap;
      gap: 30px;
      justify-content: center;
      margin-bottom: 30px;
    }

    .contact-method {
      flex: 1;
      min-width: 200px;
      max-width: 250px;
      padding: 20px;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .contact-icon {
      width: 50px;
      height: 50px;
      background-color: #ebf8ff;
      border-radius: 50%;
      margin: 0 auto 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #2c5282;
      font-size: 12px;
    }

    .contact-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #2c5282;
    }

    .contact-detail {
      font-size: 14px;
      color: #4a5568;
    }

    .footer {
      background-color: #2d3748;
      color: #fff;
      padding: 30px 40px;
      text-align: center;
      font-size: 14px;
    }

    .social-links {
      margin-bottom: 20px;
    }

    .social-link {
      display: inline-block;
      width: 40px;
      height: 40px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      margin: 0 5px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      text-decoration: none;
      font-size: 12px;
    }

    .footer-links {
      margin-bottom: 20px;
    }

    .footer-link {
      color: #fff;
      text-decoration: none;
      margin: 0 10px;
    }

    .copyright {
      opacity: 0.7;
    }
  </style>
</head>

<body>
  <div class="brochure-container">
    <div class="hero-section">
      <div class="company-logo">
        {{#if company.logoUrl}}
        <img src="" alt="Logo" height="60"/>
      {{else}}
        <div class="logo-placeholder">{{company.name}}</div>
        {{/if}}
      </div>
      <div class="hero-title">{{hero.title}}</div>
      <div class="hero-subtitle">{{hero.subtitle}}</div>
      {{#if hero.ctaButton}}
      <a href="" class="cta-button">{{hero.ctaButton.text}}</a>
      {{/if}}
    </div>

    <div class="section">
      <div class="section-title">{{features.title}}</div>
      <div class="section-subtitle">{{features.subtitle}}</div>

      <div class="feature-grid">
        {{#each features.items}}
        <div class="feature-item">
          <div class="feature-icon">{{icon}}</div>
          <div class="feature-title">{{title}}</div>
          <div class="feature-description">{{description}}</div>
        </div>
        {{/each}}
      </div>
    </div>

    <div class="section about-section">
      <div class="about-content">
        <div class="section-title">{{about.title}}</div>
        <p>{{about.description}}</p>

        {{#if about.bulletPoints}}
        <ul>
          {{#each about.bulletPoints}}
          <li>{{this}}</li>
          {{/each}}
        </ul>
        {{/if}}
      </div>

      <div class="about-image">
        {{#if about.imageUrl}}
        <img src="" alt="About" width="100%"/>
      {{else}}
        <div class="image-placeholder">COMPANY IMAGE</div>
        {{/if}}
      </div>
    </div>

    {{#if testimonial}}
    <div class="testimonial-section">
      <div class="testimonial-quote">{{testimonial.quote}}</div>
      <div class="testimonial-author">{{testimonial.author}}</div>
      <div class="testimonial-company">{{testimonial.company}}</div>
    </div>
    {{/if}}

    {{#if products}}
    <div class="section product-section">
      <div class="section-title">{{products.title}}</div>
      <div class="section-subtitle">{{products.subtitle}}</div>

      <div class="product-grid">
        {{#each products.items}}
        <div class="product-item">
          <div class="product-image">
            {{#if imageUrl}}
            <img src="" alt="" width="100%" height="100%"/>
          {{else}}
            PRODUCT IMAGE
          {{/if}}
          </div>
          <div class="product-details">
            <div class="product-title">{{title}}</div>
            <div class="product-description">{{description}}</div>
            <div class="product-price">{{price}}</div>
            <a href="" class="product-button">{{buttonText}}</a>
          </div>
        </div>
        {{/each}}
      </div>
    </div>
    {{/if}}

    <div class="section contact-section">
      <div class="section-title">{{contact.title}}</div>
      <div class="section-subtitle">{{contact.subtitle}}</div>

      <div class="contact-methods">
        {{#each contact.methods}}
        <div class="contact-method">
          <div class="contact-icon">{{icon}}</div>
          <div class="contact-title">{{title}}</div>
          <div class="contact-detail">{{{detail}}}</div>
        </div>
        {{/each}}
      </div>
    </div>

    <div class="footer">
      <div class="social-links">
        {{#each socialLinks}}
        <a href="" class="social-link">{{platform}}</a>
        {{/each}}
      </div>

      <div class="footer-links">
        {{#each footerLinks}}
        <a href="" class="footer-link">{{text}}</a>
        {{/each}}
      </div>

      <div class="copyright">{{copyright}}</div>
    </div>
  </div>
</body>

</html>`

export const handlebarJSON = {
    "hero": {
        "title": "Transforming Business Through Technology",
        "subtitle": "Innovative solutions that drive growth, efficiency, and competitive advantage",
        "ctaButton": {
            "url": "#products",
            "text": "Discover Our Solutions"
        }
    },
    "about": {
        "title": "About TechInnovate",
        "imageUrl": null,
        "description": "Founded in 2015, TechInnovate has been at the forefront of digital transformation, helping businesses across industries leverage technology to achieve their strategic objectives. Our mission is to empower organizations with innovative solutions that drive growth, efficiency, and competitive advantage.",
        "bulletPoints": [
            "10+ years of industry experience",
            "200+ successful projects delivered",
            "98% client satisfaction rate",
            "Global team of certified experts"
        ]
    },
    "company": {
        "name": "TechInnovate",
        "logoUrl": null
    },
    "contact": {
        "title": "Get In Touch",
        "methods": [
            {
                "icon": "ICON",
                "title": "Call Us",
                "detail": "+1 (555) 123-4567<br>Monday-Friday, 9am-5pm EST"
            },
            {
                "icon": "ICON",
                "title": "Email Us",
                "detail": "info@techinnovate.com<br>We respond within 24 hours"
            },
            {
                "icon": "ICON",
                "title": "Visit Us",
                "detail": "123 Tech Plaza, Suite 500<br>San Francisco, CA 94105"
            }
        ],
        "subtitle": "We are here to answer your questions and help you succeed"
    },
    "features": {
        "items": [
            {
                "icon": "ICON",
                "title": "Cutting-Edge Technology",
                "description": "We leverage the latest technologies to create solutions that keep you ahead of the competition."
            },
            {
                "icon": "ICON",
                "title": "Expert Team",
                "description": "Our team of certified professionals brings decades of industry experience to every project."
            },
            {
                "icon": "ICON",
                "title": "Tailored Solutions",
                "description": "We create customized solutions that address your specific business challenges and objectives."
            },
            {
                "icon": "ICON",
                "title": "Ongoing Support",
                "description": "We provide comprehensive support to ensure your systems run smoothly and efficiently."
            }
        ],
        "title": "Why Choose Us",
        "subtitle": "We deliver exceptional value through our comprehensive approach"
    },
    "products": {
        "items": [
            {
                "price": "Starting at $499/month",
                "title": "Enterprise Cloud Platform",
                "imageUrl": null,
                "buttonUrl": "#cloud",
                "buttonText": "Learn More",
                "description": "Secure, scalable cloud infrastructure designed for enterprise workloads with 99.9% uptime guarantee."
            },
            {
                "price": "Starting at $299/month",
                "title": "Data Analytics Suite",
                "imageUrl": null,
                "buttonUrl": "#analytics",
                "buttonText": "Learn More",
                "description": "Advanced analytics tools that transform your data into actionable business insights."
            },
            {
                "price": "Starting at $199/month",
                "title": "Cybersecurity Services",
                "imageUrl": null,
                "buttonUrl": "#security",
                "buttonText": "Learn More",
                "description": "Comprehensive security solutions to protect your business from evolving threats."
            }
        ],
        "title": "Our Solutions",
        "subtitle": "Comprehensive technology solutions tailored to your business needs"
    },
    "copyright": "© 2025 TechInnovate. All rights reserved.",
    "footerLinks": [
        {
            "url": "#about",
            "text": "About Us"
        },
        {
            "url": "#services",
            "text": "Services"
        },
        {
            "url": "#case-studies",
            "text": "Case Studies"
        },
        {
            "url": "#privacy",
            "text": "Privacy Policy"
        },
        {
            "url": "#terms",
            "text": "Terms of Service"
        }
    ],
    "socialLinks": [
        {
            "url": "#facebook",
            "platform": "FB"
        },
        {
            "url": "#twitter",
            "platform": "TW"
        },
        {
            "url": "#linkedin",
            "platform": "LI"
        },
        {
            "url": "#instagram",
            "platform": "IG"
        }
    ],
    "testimonial": {
        "quote": "TechInnovate transformed our operations with their innovative solutions. Their teams expertise and dedication to our success made all the difference. We have seen a 40% increase in efficiency since implementing their systems.",
        "author": "Jennifer Martinez",
        "company": "CEO, Global Enterprises"
    }
}