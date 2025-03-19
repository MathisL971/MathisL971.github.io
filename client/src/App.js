import React from "react";
import "./index.css";
import { useEffect, useRef, useState } from "react";
import { Github, Linkedin, Instagram, Mail, FileDown } from "lucide-react";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("https://github-api-worker.corweb.io")
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className="flex flex-col xl:flex-row h-screen bg-dark justify-center xl:px-32 xl:justify-between 2xl:justify-evenly xl:gap-10">
      <div className="flex flex-col justify-center gap-4 sm:gap-6 px-4 sm:px-12 md:px-18 lg:px-24 xl:px-0">
        <div className="flex flex-row items-center gap-4 sm:gap-6 md:gap-8">
          <img
            alt=""
            src="/profile.jpg"
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-light"
          ></img>
          <div className="flex flex-col items-start justify-center flex-grow-0 xl:flex-grow">
            <h2 className="text-secondary">Full Stack Developer</h2>
            <h1 className="text-white">Mathis Lefranc</h1>
          </div>
        </div>
        <div className="text-white flex flex-col gap-1 mb-3">
          <p>
            <span className="mr-3">🏝️</span>Raised on an island
          </p>
          <p>
            <span className="mr-3">🇨🇦</span>Moved to the Great North
          </p>
          <p>
            <span className="mr-3">🎮</span>Played video games during 6 years to
            cope
          </p>
          <p>
            <span className="mr-3">💼</span>Put down the controller and studied
            to become a finance bro but lost interest
          </p>
          <p>
            <span className="mr-3">💻</span>Switched to computer science and now
            a full stack developer, mostly web
          </p>
          <p>
            <span className="mr-3">🌐</span>Comfortable with React and
            Typescript, JS or Python on the server, and SQL databases.
          </p>
        </div>
        <ResumeDownloadButton />
      </div>
      <div className="flex flex-col xl:flex-row gap-8 mt-10 xl:mt-0">
        <ProjectCarousel projects={projects} />
        <SocialLinksBar />
      </div>
    </div>
  );
};

const ProjectCarousel = ({ projects = [] }) => {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isXlScreen, setIsXlScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsXlScreen(window.innerWidth >= 1280); // 1280px is Tailwind's xl breakpoint
    };

    // Initial check
    checkScreenSize();

    // Add listener for resize events
    window.addEventListener("resize", checkScreenSize);

    // Clean up
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;

    const scrollContainer = scrollRef.current;
    let animationFrameId;

    const scroll = () => {
      // Don't scroll when hovered
      if (!isHovered) {
        if (isXlScreen) {
          // Vertical scrolling (top to bottom)
          scrollContainer.scrollTop += 1;

          // Check if we've reached the bottom
          if (
            scrollContainer.scrollTop + scrollContainer.clientHeight >=
            scrollContainer.scrollHeight
          ) {
            // Jump back to top
            scrollContainer.scrollTop = 0;
          }
        } else {
          // Horizontal scrolling (right to left)
          scrollContainer.scrollLeft += 1;

          // Reset scroll position when it reaches the end
          if (
            scrollContainer.scrollLeft >=
            scrollContainer.scrollWidth - scrollContainer.clientWidth
          ) {
            scrollContainer.scrollLeft = 0;
          }
        }
      }

      animationFrameId = requestAnimationFrame(scroll);
    };

    // Start auto-scrolling immediately when component mounts
    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered, isXlScreen]);

  return (
    <div
      className="overflow-hidden shadow-md w-full xl:w-96"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={scrollRef}
        className={`flex xl:flex-col overflow-x-scroll xl:overflow-x-hidden xl:overflow-y-scroll scrollbar-hide gap-6 xl:h-screen xl:py-10`}
        style={{ 
          scrollBehavior: "smooth",
          msOverflowStyle: "none",
          scrollbarWidth: "none" 
        }}
      >
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}

        {/* Adding duplicates for seamless looping */}
        {projects.map((project, index) => (
          <ProjectCard key={"duplicate-" + index} project={project} />
        ))}
      </div>
    </div>
  );
};

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-primary p-6 rounded-lg shadow-lg">
      <div className="flex justify-between flex-col xl:flex-row">
        <h3 className="text-lg font-semibold mb-2 text-dark">
          {project.name}
        </h3>
        <div className="flex gap-2 mb-4">
          {false && (
            <a
              href={"https://" + project.name + ".corweb.io"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center bg-white px-2 py-1 rounded"
            >
              <svg
                className="w-4 h-4 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 3H21V9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 14L21 3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Demo
            </a>
          )}

          {project.html_url && (
            <a
              href={project.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-gray-900 text-sm flex items-center bg-white px-2 py-1 rounded"
            >
              <svg
                className="w-4 h-4 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.47715 2 2 6.47715 2 12C2 16.4183 4.85617 20.1905 8.8375 21.5375C9.33583 21.6258 9.5 21.3308 9.5 21.0783V19.3058C6.7275 19.9175 6.14167 18.0583 6.14167 18.0583C5.68333 16.9708 5.02833 16.6758 5.02833 16.6758C4.12167 16.0225 5.0975 16.0342 5.0975 16.0342C6.10167 16.1033 6.63 17.0808 6.63 17.0808C7.52167 18.6492 8.97 18.1017 9.54 17.8492C9.63 17.2192 9.88917 16.7717 10.175 16.5192C7.95417 16.2667 5.61917 15.4258 5.61917 11.5367C5.61917 10.4608 6.00833 9.58667 6.64917 8.9225C6.54417 8.67917 6.20333 7.65833 6.74667 6.2475C6.74667 6.2475 7.58667 5.99417 9.49667 7.3275C10.295 7.1175 11.15 7.0125 12 7.00833C12.85 7.0125 13.7067 7.1175 14.5067 7.3275C16.415 5.99417 17.2533 6.2475 17.2533 6.2475C17.7967 7.65833 17.4558 8.67917 17.3508 8.9225C17.9933 9.58667 18.3792 10.4608 18.3792 11.5367C18.3792 15.4375 16.0408 16.2633 13.8133 16.5075C14.1717 16.8142 14.5 17.4258 14.5 18.3625V21.0783C14.5 21.3333 14.6625 21.6308 15.1692 21.5375C19.1458 20.1875 22 16.4167 22 12C22 6.47715 17.5228 2 12 2Z"
                  fill="currentColor"
                />
              </svg>
              GitHub
            </a>
          )}
        </div>
      </div>

      <p className="text-sm text-secondary w-64 xl:w-auto">
        {project.description ? project.description : "No description"}
      </p>

      {project.languages && project.languages.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {project.languages.map((lang, langIndex) => (
            <span
              key={langIndex}
              className="bg-white text-dark text-xs px-2 py-1 rounded"
            >
              {lang}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const SocialLinksBar = () => {
  const socialLinks = [
    {
      icon: <Github size={24} />,
      name: "GitHub",
      url: "https://github.com/MathisL971",
      color: "hover:text-primary",
    },
    {
      icon: <Linkedin size={24} />,
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/mathis-lefranc/",
      color: "hover:text-primary",
    },
    {
      icon: <Instagram size={24} />,
      name: "Instagram",
      url: "https://www.instagram.com/mathisl.971/",
      color: "hover:text-primary",
    },
    {
      icon: <Mail size={24} />,
      name: "Email",
      url: "mailto:lefrancmathis@gmail.com",
      color: "hover:text-primary",
    },
  ];

  return (
    <div className="flex xl:flex-col items-center justify-center gap-5 rounded-lg shadow-sm">
      {socialLinks.map((social, index) => (
        <a
          key={index}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-gray-500 bg-white rounded-full p-3 ${social.color} transition-colors duration-200`}
          aria-label={social.name}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
};

const ResumeDownloadButton = () => {
  const handleDownload = () => {
    const resumeUrl = "/resume.pdf";

    const link = document.createElement("a");
    link.href = resumeUrl;
    link.download = "resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      className="group flex items-center gap-2 text-dark bg-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-1 mx-auto"
    >
      <FileDown size={20} className="group-hover:animate-bounce" />
      <span>Download Resume</span>
    </button>
  );
};

export default App;
