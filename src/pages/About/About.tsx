import React from 'react';
import './About.css'

const AboutPage = () => {
  return (
    <div className="about-page">
    <img className='logo-image' src={process.env.PUBLIC_URL + '/logo.png'} alt="Logo" />
      <h1>AI Music Producer</h1>
        <p>AI Music Producer is an innovative tool that empowers musicians to craft music in the style of their favorite artists with the help of AI technology.</p>
        <p>View the <a href="https://www.npmjs.com/package/tone" target='blank'>source code on Github</a></p>

        <h2>How it Works</h2>
        <ul>
            <li><strong>Artist Selection:</strong><br/>Begin by inputting the name of your favorite artist or band.</li>
            <li><strong>AI Insights:</strong><br/>The app queries OpenAI's GPT engine to provide you with insightful instructions and inspiring ideas on how to compose music in the distinct style of your chosen artist.</li>
            <li><strong>Project Page:</strong><br/> Dive into the creative process on a dedicated project page that breaks down the musical composition into key sections: Intro, Verse, Chorus, Bridge, and Outro.</li>
            <li><strong>Songwriting tools:</strong>
                <ul>
                    <li><strong>- Inspiration and Rule Set Generator:</strong> Generate a random rule set including Song key, BPM, and Sound ideas</li>
                    <li><strong>- Metronome:</strong> The BPM is set by the inspiration generator</li>
                    <li><strong>- Pomodoro Timer:</strong> Stay focused and productive with timed work sessions</li>
                    <li><strong>- Note-Taking Area:</strong> Capture your thoughts, ideas, and musical concepts as they flow</li>
                    <li><strong>- Expert Advice:</strong> Receive valuable songwriting insights in the style of renowned producers and musicians such as Rick Rubin, Jeff Tweedy, and more!</li>
                </ul>
            </li>
        </ul>

        <h2>Technologies Used</h2>
        <ul>
            <li>- React</li>
            <li>- Typescript</li>
            <li>- openAPI GPT 3.5 Turbo engine</li>
            <li>- Freepik AI Image Generator</li>
            <li>- Figma for wireframing</li>
            <li>- <a href="https://fontawesome.com/" target='blank' >Font Awesome</a> for icons</li>
            <li>- Metronome icon created by <a href="https://www.flaticon.com/free-icons/tempo" target='blank' >Flaticon</a></li>
            <li><a href="https://www.npmjs.com/package/tone" target='blank' >Tone.js</a> for metronome sound</li>
        </ul>

    </div>
  );
};

export default AboutPage;
