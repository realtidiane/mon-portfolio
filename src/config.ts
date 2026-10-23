export const config = {
    developer: {
        name: "Tidiane",
        fullName: "Tidiane SY",
        title: "Administrateur Sécurité & Réseaux · Développeur Fullstack",
        description: "Technicien supérieur en cybersécurité et développeur fullstack. Je couvre toute la chaîne : réseaux et télécoms, systèmes, virtualisation, sécurité offensive et défensive, audit de conformité et développement fullstack."
    },
    social: {
        github: "realtidiane",
        email: "tidianepro.sn@gmail.com",
        location: "Dakar, Sénégal"
    },
    about: {
        title: "À propos",
        description: "Diplômé en Télécommunications et Réseaux, j'évolue en tant que technicien supérieur en cybersécurité et développeur fullstack. Véritable autodidacte et passionné par la forensique ainsi que le reverse engineering, j'investis continuellement mon temps libre pour maîtriser ces disciplines pointues. Toujours à la recherche de nouveaux défis technologiques, je combine mes compétences académiques et mon expertise autoformée pour contribuer à des projets innovants. Ma polyvalence me permet de maîtriser l'ensemble de la chaîne technique : réseaux, systèmes, DevOps, sécurité offensive et défensive, audit de conformité et développement fullstack."
    },
    experiences: [
        {
            position: "Stagiaire en développement et réseau",
            company: "RTN (Réseaux et Techniques Numériques)",
            period: "Mars - Septembre 2026",
            location: "Dakar, Sénégal",
            description: "Étude et mise en place d'une plateforme d'audit de sécurité réseau basée sur la norme ISO/CEI 27005 et pilotée par l'IA.",
            responsibilities: [
                "Audit de sécurité réseau selon ISO/CEI 27005",
                "Développement d'une plateforme d'audit pilotée par l'IA",
                "Analyse des vulnérabilités réseau",
                "Rédaction de rapports techniques de sécurité"
            ],
            technologies: ["ISO 27005", "IA", "Réseau", "Audit sécurité", "Python"]
        },
        {
            position: "Technicien supérieur en cybersécurité",
            company: "EC2LT - École Centrale des Logiciels Libres et de la Télécommunication",
            period: "2023 - 2026",
            location: "Dakar, Sénégal",
            description: "Diplômé en cybersécurité. Maîtrise de la sécurité offensive et défensive, de l'audit de conformité et de l'administration réseau et systèmes.",
            responsibilities: [
                "Pentest et Red Team : Kali Linux, Nmap, Metasploit, Burp Suite, BloodHound",
                "Blue Team : SIEM Wazuh, YARA, forensics (Volatility), IDS/IPS, VPN, TLS, WAF",
                "Audit et conformité : ISO 27005/27002, EBIOS RM",
                "Reverse Engineering : Ghidra, IDA, Frida",
                "Administration réseau et systèmes : Linux, Windows Server, Active Directory"
            ],
            technologies: ["Cybersécurité", "Pentest", "Blue Team", "ISO 27005", "Reverse Engineering", "Linux", "Windows Server"]
        },
        {
            position: "Licence IDA - Informatique et Développement d'Applications",
            company: "UNCHK - Université Numérique Cheikh Hamidou Kane",
            period: "2022 - 2026",
            location: "Dakar, Sénégal",
            description: "Formation en développement fullstack et informatique. Maîtrise de React, TypeScript, Node.js, Python et FastAPI.",
            responsibilities: [
                "Développement fullstack : React, TypeScript, Node.js, Python, FastAPI",
                "Bases de données : PostgreSQL, MySQL",
                "Gestion de projets : méthodes agiles, rédaction de rapports techniques",
                "DevOps : Git/GitHub, Docker, Ansible"
            ],
            technologies: ["React", "TypeScript", "Node.js", "Python", "FastAPI", "PostgreSQL", "MySQL", "Docker"]
        },
        {
            position: "Baccalauréat Sciences sociales (L2)",
            company: "Collège Saint Gabriel",
            period: "2022",
            location: "Thiès, Sénégal",
            description: "Diplôme du baccalauréat en sciences sociales.",
            responsibilities: [],
            technologies: []
        }
    ],
    projects: [
        {
            id: 1,
            title: "Aria",
            category: "Intelligence artificielle",
            technologies: "Python, FastAPI, React, IA",
            image: "/images/aria.png",
            description: "Application d'audit assiste par l'IA. Interface moderne et réactive pour l'interaction homme-machine.",
            link: "https://aria.deadsec.tech"
        },
        {
            id: 2,
            title: "Senegram",
            category: "Réseau social · Communication",
            technologies: "React, Node.js, Python, WebSocket, MongoDB",
            image: "/images/senegram.png",
            description: "Plateforme de communication et de réseau social développée pour la communauté sénégalaise. Messagerie en temps réel, partage de contenu et profils utilisateurs.",
            link: "https://senegram.deadsec.tech"
        },
        {
            id: 3,
            title: "Infrastructure virtualisée",
            category: "DevOps · Virtualisation",
            technologies: "Proxmox, Ceph, OpenStack, Ansible, Linux, Docker",
            image: "/images/virtualization.png",
            description: "Infrastructure virtualisée haute disponibilité avec Proxmox, Ceph et OpenStack. Automatisation avec Ansible et conteneurisation avec Docker.",
        },
        {
            id: 4,
            title: "Système de monitoring et Blue Team",
            category: "Sécurité défensive",
            technologies: "Wazuh, YARA, Volatility, IDS/IPS, VPN, TLS, WAF, Linux",
            image: "/images/blue-team.png",
            description: "Système de détection et de réponse aux incidents avec SIEM Wazuh, règles YARA, analyses forensics avec Volatility, et durcissement réseau avec IDS/IPS, VPN et WAF.",
        }
    ],
    contact: {
        email: "tidianepro.sn@gmail.com",
        github: "https://github.com/realtidiane",
        linkedin: "https://www.linkedin.com/in/cheikh-tidiane-sy",
        phone: "+221 78 385 67 64",
        // Numero au format international, sans "+" ni espaces (convention wa.me).
        whatsapp: "221783856764",
        // Message pre-rempli dans la discussion WhatsApp.
        whatsappMessage:
            "Bonjour Tidiane, je vous contacte depuis votre portfolio.",
        website: "https://tidiane.deadsec.tech"
    },
    skills: {
        develop: {
            title: "DÉVELOPPEMENT FULLSTACK",
            description: "Applications web modernes et évolutives",
            details: "Développement d'applications web fullstack avec React, TypeScript, Node.js, Python et FastAPI. Bases de données PostgreSQL et MySQL. Conteneurisation avec Docker et automatisation avec Ansible.",
            tools: ["React", "TypeScript", "Node.js", "Python", "FastAPI", "PostgreSQL", "MySQL", "Docker", "Ansible", "Git"]
        },
        secure: {
            title: "CYBERSÉCURITÉ",
            description: "Sécurité offensive, défensive et audit",
            details: "Pentest et Red Team (Kali Linux, Nmap, Metasploit, Burp Suite, BloodHound), Blue Team (Wazuh, YARA, Volatility, IDS/IPS, VPN, TLS, WAF), audit de conformité (ISO 27005/27002, EBIOS RM, PSSI), Reverse Engineering (Ghidra, IDA, Frida).",
            tools: ["Kali Linux", "Nmap", "Metasploit", "Burp Suite", "BloodHound", "Wazuh", "YARA", "Volatility", "ISO 27005", "EBIOS RM", "Ghidra", "Frida"]
        }
    }
};