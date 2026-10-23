import "./styles/TechStackNew.css";

interface TechItem {
  name: string;
  icon: string;
  url: string;
}

// Tech stack complet propulsé par https://api.iconify.design/ (icon-sets.iconify.design)
// Structure pyramidale sur 7 rangées : 12 -> 10 -> 8 -> 6 -> 5 -> 3 -> 2 (46 outils)
const techStack: TechItem[][] = [
  // Row 1 - 12 items (Langages & Front-End)
  [
    { name: "Python", icon: "https://api.iconify.design/devicon/python.svg", url: "https://python.org" },
    { name: "TypeScript", icon: "https://api.iconify.design/devicon/typescript.svg", url: "https://typescriptlang.org" },
    { name: "JavaScript", icon: "https://api.iconify.design/devicon/javascript.svg", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    { name: "C++", icon: "https://api.iconify.design/devicon/cplusplus.svg", url: "https://isocpp.org" },
    { name: "PHP", icon: "https://api.iconify.design/devicon/php.svg", url: "https://php.net" },
    { name: "Bash", icon: "https://api.iconify.design/devicon/bash.svg", url: "https://www.gnu.org/software/bash/" },
    { name: "HTML", icon: "https://api.iconify.design/devicon/html5.svg", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
    { name: "CSS", icon: "https://api.iconify.design/devicon/css3.svg", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
    { name: "React", icon: "https://api.iconify.design/devicon/react.svg", url: "https://react.dev" },
    { name: "React Native", icon: "https://api.iconify.design/tabler/brand-react-native.svg?color=%2361dafb", url: "https://reactnative.dev" },
    { name: "Tailwind", icon: "https://api.iconify.design/devicon/tailwindcss.svg", url: "https://tailwindcss.com" },
    { name: "Bootstrap", icon: "https://api.iconify.design/devicon/bootstrap.svg", url: "https://getbootstrap.com" },
  ],
  // Row 2 - 10 items (Back-End, Temps Réel & Bases de données)
  [
    { name: "Node.js", icon: "https://api.iconify.design/devicon/nodejs.svg", url: "https://nodejs.org" },
    { name: "NestJS", icon: "https://api.iconify.design/devicon/nestjs.svg", url: "https://nestjs.com" },
    { name: "Express", icon: "https://api.iconify.design/simple-icons/express.svg?color=%23ffffff", url: "https://expressjs.com" },
    { name: "FastAPI", icon: "https://api.iconify.design/devicon/fastapi.svg", url: "https://fastapi.tiangolo.com" },
    { name: "Django", icon: "https://api.iconify.design/vscode-icons/file-type-django.svg", url: "https://djangoproject.com" },
    { name: "Prisma", icon: "https://api.iconify.design/devicon/prisma.svg", url: "https://prisma.io" },
    { name: "Socket.IO", icon: "https://api.iconify.design/simple-icons/socketdotio.svg?color=%23ffffff", url: "https://socket.io" },
    { name: "PostgreSQL", icon: "https://api.iconify.design/devicon/postgresql.svg", url: "https://postgresql.org" },
    { name: "MySQL", icon: "https://api.iconify.design/devicon/mysql.svg", url: "https://mysql.com" },
    { name: "Redis", icon: "https://api.iconify.design/devicon/redis.svg", url: "https://redis.io" },
  ],
  // Row 3 - 8 items (DevOps, Virtualisation, Cloud & Infra)
  [
    { name: "Docker", icon: "https://api.iconify.design/devicon/docker.svg", url: "https://docker.com" },
    { name: "Ansible", icon: "https://api.iconify.design/devicon/ansible.svg", url: "https://ansible.com" },
    { name: "Proxmox", icon: "https://api.iconify.design/simple-icons/proxmox.svg?color=%23E57000", url: "https://proxmox.com" },
    { name: "Ceph", icon: "https://api.iconify.design/simple-icons/ceph.svg?color=%23EF5C55", url: "https://ceph.io" },
    { name: "OpenStack", icon: "https://api.iconify.design/devicon/openstack.svg", url: "https://openstack.org" },
    { name: "Git", icon: "https://api.iconify.design/devicon/git.svg", url: "https://git-scm.com" },
    { name: "GitHub", icon: "https://api.iconify.design/mdi/github.svg?color=%23ffffff", url: "https://github.com" },
    { name: "Asterisk", icon: "https://api.iconify.design/simple-icons/asterisk.svg?color=%23F68B1F", url: "https://asterisk.org" },
  ],
  // Row 4 - 6 items (Systèmes, Annuaire & Environnement)
  [
    { name: "Linux", icon: "https://api.iconify.design/devicon/linux.svg", url: "https://linux.org" },
    { name: "Ubuntu", icon: "https://api.iconify.design/logos/ubuntu.svg", url: "https://ubuntu.com" },
    { name: "Active Directory", icon: "https://api.iconify.design/devicon/windows8.svg", url: "https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview" },
    { name: "Postman", icon: "https://api.iconify.design/devicon/postman.svg", url: "https://postman.com" },
    { name: "VS Code", icon: "https://api.iconify.design/devicon/vscode.svg", url: "https://code.visualstudio.com" },
    { name: "Hugging Face", icon: "https://api.iconify.design/logos/hugging-face-icon.svg", url: "https://huggingface.co" },
  ],
  // Row 5 - 5 items (Pentest, Red Team & AD Exploitation)
  [
    { name: "Kali Linux", icon: "https://api.iconify.design/devicon/kalilinux.svg", url: "https://kali.org" },
    { name: "Burp Suite", icon: "https://api.iconify.design/devicon-plain/burpsuite.svg?color=%23FF6633", url: "https://portswigger.net/burp" },
    { name: "Metasploit", icon: "https://api.iconify.design/simple-icons/metasploit.svg?color=%232596CD", url: "https://metasploit.com" },
    { name: "Nmap", icon: "https://api.iconify.design/file-icons/nmap.svg?color=%234682B4", url: "https://nmap.org" },
    { name: "BloodHound", icon: "https://api.iconify.design/mdi/dog-side.svg?color=%23ff3b3b", url: "https://github.com/SpecterOps/BloodHound" },
  ],
  // Row 6 - 3 items (Blue Team, SIEM, Threat Hunting & Réseau)
  [
    { name: "Wazuh", icon: "https://api.iconify.design/mdi/shield-search.svg?color=%2300A9E0", url: "https://wazuh.com" },
    { name: "Wireshark", icon: "https://api.iconify.design/simple-icons/wireshark.svg?color=%231679A7", url: "https://wireshark.org" },
    { name: "YARA", icon: "https://api.iconify.design/file-icons/yara.svg?color=%23e05d44", url: "https://virustotal.github.io/yara/" },
  ],
  // Row 7 - 2 items (Sommet de la pyramide : Reverse Engineering & Forensics)
  [
    { name: "Ghidra", icon: "https://api.iconify.design/devicon-plain/ghidra.svg?color=%23e53935", url: "https://ghidra-sre.org" },
    { name: "Frida", icon: "https://api.iconify.design/mdi/bug-outline.svg?color=%23ef6c00", url: "https://frida.re" },
    { name: "Volatility", icon: "https://api.iconify.design/mdi/memory.svg?color=%2300e676", url: "https://volatilityfoundation.org" },
  ],
];

const TechStackNew = () => {
  return (
    <div className="techstack-new">
      {/* Video Background */}
      <div className="techstack-video-container">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="techstack-video"
        >
          <source src="/video/video.webm" type="video/webm" />
        </video>
        {/* Dark Overlay */}
        <div className="techstack-overlay"></div>
      </div>

      {/* Content */}
      <div className="techstack-content">
        <h2>Stack Technique</h2>

        <div className="techstack-pyramid">
          {techStack.map((row, rowIndex) => (
            <div key={rowIndex} className="techstack-row">
              {row.map((tech, techIndex) => (
                <a
                  key={techIndex}
                  href={tech.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="techstack-item"
                  title={tech.name}
                  data-cursor="disable"
                >
                  <img
                    src={tech.icon}
                    alt={tech.name}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      // Fallback vers une icône cyber/terminal d'Iconify si jamais une URL ne charge pas
                      e.currentTarget.src = "https://api.iconify.design/mdi/shield-bug-outline.svg?color=%23c2a4ff";
                    }}
                  />
                  <span>{tech.name}</span>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStackNew;