import { Code, User, Briefcase, Trophy } from "lucide-react";

export const AboutSection = () => {
    return (
        <section id="about" className="py-24 px-4 relative">
            <div className="container mx-auto max-w-5xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                    About <span className="text-primary">Me</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold">
                            I'm Dave, a passionate Full Stack Developer & An Active Volunteer in Tech Organizations
                        </h3>
                        <p className="text-lg text-muted-foreground">
                            I'm a passionate developer with experience in creating modern web
                            applications. I specialize in JavaScript, PHP, React, and Node.js.
                        </p>
                        <p className="text-lg text-muted-foreground">
                            As an active volunteer in tech organizations, I'm dedicated to giving
                            back to the community and helping others learn and grow in their coding journeys.
                        </p>
                        <p className="text-lg text-muted-foreground">
                            I'm always eager to take on new challenges and collaborate on exciting projects. Let's connect and create something amazing together!
                        </p>
                        <div className="flex flex-col gap-4 pt-4">
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="contacts" className="cosmic-button">
                                    Get in Touch
                                </a>
                                <a
                                    href="assets/DavePunzalan_Resume.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors duration-300 text-center"
                                    >
                                    Download CV
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="gradient-border p-6 card-hover">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Code className="h-6 w-6 text-primary" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-semibold text-lg">Front End Developer</h4>
                                    <p className="text-muted-foreground">
                                        I build modern web applications using cutting-edge technologies.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="gradient-border p-6 card-hover">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <User className="h-6 w-6 text-primary" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-semibold text-lg">Software Engineer</h4>
                                    <p className="text-muted-foreground">
                                        I design and implement efficient solutions to complex problems.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="gradient-border p-6 card-hover">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Briefcase className="h-6 w-6 text-primary" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-semibold text-lg">Tech Volunteer</h4>
                                    <p className="text-muted-foreground">
                                        I actively contribute to tech communities and mentor aspiring developers.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="gradient-border p-6 card-hover">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Trophy className="h-6 w-6 text-primary" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-semibold text-lg">Student Leader and Tech Enthusiast</h4>
                                    <p className="text-muted-foreground">
                                        Actively involved in Organizations, leading initiatives and fostering a passion for technology among peers.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};