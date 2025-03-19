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
  const contentRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isXlScreen, setIsXlScreen] = useState(false);
  const scrollAnimationRef = useRef(null);
  const lastTimeRef = useRef(0);
  const scrollPositionRef = useRef(0);
  const scrollSpeedRef = useRef(0.05); // pixels per millisecond
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef(null);
  const startPosRef = useRef(0);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsXlScreen(window.innerWidth >= 1280);
    };

    // Initial check
    checkScreenSize();
    
    // Debounced resize handler
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkScreenSize, 100);
    };
    
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  useEffect(() => {
    if (!scrollRef.current || !contentRef.current) return;

    const scrollContainer = contentRef.current;
    let isResetting = false;
    
    const animateScroll = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      
      if (isHovered || isResetting) {
        scrollAnimationRef.current = requestAnimationFrame(animateScroll);
        return;
      }

      // Calculate scroll increment based on elapsed time for consistent speed
      const scrollIncrement = deltaTime * scrollSpeedRef.current;
      scrollPositionRef.current += scrollIncrement;
      
      if (isXlScreen) {
        // Vertical scrolling with transform for better performance
        const maxScroll = scrollContainer.scrollHeight - scrollRef.current.clientHeight;
        
        // Apply scroll position
        if (scrollPositionRef.current > maxScroll) {
          // Handle reset for infinite loop
          isResetting = true;
          // Use CSS transition for smooth reset
          scrollContainer.style.transition = 'transform 2s ease-out';
          scrollContainer.style.transform = `translateY(0)`;
          
          setTimeout(() => {
            // Remove transition after reset
            scrollContainer.style.transition = 'none';
            scrollPositionRef.current = 0;
            isResetting = false;
          }, 500);
        } else {
          // Apply transform for smooth scrolling
          scrollContainer.style.transform = `translateY(-${scrollPositionRef.current}px)`;
        }
      } else {
        // Horizontal scrolling with transform
        const maxScroll = scrollContainer.scrollWidth - scrollRef.current.clientWidth;
        
        if (scrollPositionRef.current > maxScroll) {
          // Handle reset for infinite loop
          isResetting = true;
          scrollContainer.style.transition = 'transform 0.5s ease-out';
          scrollContainer.style.transform = `translateX(0)`;
          
          setTimeout(() => {
            scrollContainer.style.transition = 'none';
            scrollPositionRef.current = 0;
            isResetting = false;
          }, 500);
        } else {
          // Apply transform for smooth scrolling
          scrollContainer.style.transform = `translateX(-${scrollPositionRef.current}px)`;
        }
      }

      scrollAnimationRef.current = requestAnimationFrame(animateScroll);
    };

    // Start animation
    scrollAnimationRef.current = requestAnimationFrame(animateScroll);

    // Clean up
    return () => {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }
    };
  }, [isHovered, isXlScreen]);

  const handleMouseDown = (e) => {
    if (!isHovered) return;
    
    setIsDragging(true);
    dragStartRef.current = isXlScreen ? e.clientY : e.clientX;
    startPosRef.current = scrollPositionRef.current;
    
    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !contentRef.current) return;
    
    const currentPoint = isXlScreen ? e.clientY : e.clientX;
    const diff = dragStartRef.current - currentPoint;
    const newPosition = startPosRef.current + diff;
    
    // Ensure we don't scroll past boundaries
    if (newPosition >= 0) {
      scrollPositionRef.current = newPosition;
      
      if (isXlScreen) {
        contentRef.current.style.transform = `translateY(-${newPosition}px)`;
      } else {
        contentRef.current.style.transform = `translateX(-${newPosition}px)`;
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.userSelect = '';
  };

  // Add touch support
  const handleTouchStart = (e) => {
    if (!isHovered) setIsHovered(true);
    
    dragStartRef.current = isXlScreen ? e.touches[0].clientY : e.touches[0].clientX;
    startPosRef.current = scrollPositionRef.current;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !contentRef.current) return;
    
    const currentPoint = isXlScreen ? e.touches[0].clientY : e.touches[0].clientX;
    const diff = dragStartRef.current - currentPoint;
    const newPosition = startPosRef.current + diff;
    
    if (newPosition >= 0) {
      scrollPositionRef.current = newPosition;
      
      if (isXlScreen) {
        contentRef.current.style.transform = `translateY(-${newPosition}px)`;
      } else {
        contentRef.current.style.transform = `translateX(-${newPosition}px)`;
      }
    }
    
    // Prevent page scrolling
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // Keep hovered state for a brief period to allow viewing
    setTimeout(() => {
      setIsHovered(false);
    }, 1500);
  };

  // Reset scroll position and animation when screen size changes
  useEffect(() => {
    if (contentRef.current) {
      scrollPositionRef.current = 0;
      contentRef.current.style.transform = 'translate(0, 0)';
      contentRef.current.style.transition = 'none';
      lastTimeRef.current = 0;
    }
  }, [isXlScreen]);

  // Add global mouse/touch event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, isXlScreen]);

  return (
    <div
      className="overflow-hidden shadow-md w-full xl:w-96"
      ref={scrollRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div
        ref={contentRef}
        className="flex xl:flex-col w-fit gap-6 px-8 sm:px-12 md:px-18 lg:px-24 xl:px-0 xl:py-16"
        style={{
          willChange: "transform", // Hint to browser for optimization
          backfaceVisibility: "hidden", // Prevent flickering in some browsers
          transform: "translate3d(0, 0, 0)", // Force GPU acceleration
          cursor: isHovered ? "grab" : "auto",
          touchAction: "none" // Prevent browser handling of touch events
        }}
      >
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}

        {/* Duplicates for seamless looping */}
        {projects.map((project, index) => (
          <ProjectCard key={`duplicate-${index}`} project={project} />
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
    link.download = "Resume_Mathis_Lefranc.pdf";
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
