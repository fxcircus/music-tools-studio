import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaGithub, FaReact, FaNodeJs, FaIcons } from 'react-icons/fa';
import { Container, Card, CardHeader, CardTitle, CardIconWrapper } from '../../components/common/StyledComponents';
import { Icon } from '../../utils/IconHelper';

const AboutContainer = styled(Container)`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.xxl}`};
  max-width: 900px;
  
  @media (max-width: 768px) {
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.sm} ${theme.spacing.xl}`};
  }
`;

const AboutCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Logo = styled.img`
  max-height: 100px;
  border: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary}33;
`;

const Paragraph = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.md};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const List = styled.ul`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-left: ${({ theme }) => theme.spacing.lg};
`;

const ListItem = styled.li`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.md};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const NestedList = styled.ul`
  margin-top: ${({ theme }) => theme.spacing.xs};
  padding-left: ${({ theme }) => theme.spacing.lg};
`;

const StyledLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};
  font-weight: 500;
  
  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
    text-decoration: underline;
  }
`;

const Strong = styled.strong`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const TechList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TechItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  box-shadow: ${({ theme }) => theme.shadows.small};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const IconContainer = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AboutPage = () => {
  return (
    <AboutContainer
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AboutCard>
        <CardHeader>
          <CardTitle>Tiles</CardTitle>
        </CardHeader>
        
        <LogoContainer>
          <Logo src={process.env.PUBLIC_URL + '/logo_2025.png'} alt="Tiles Logo" />
        </LogoContainer>
        
        <Section>
          <Paragraph style={{ textAlign: 'center' }}>
            Tools for creative flow
          </Paragraph>
          <Paragraph style={{ textAlign: 'center' }}>
             <StyledLink href="https://github.com/fxcircus/music-tools-studio" target="_blank" rel="noopener noreferrer">
              View the source code on GitHub <Icon icon={FaGithub} size={16} />
            </StyledLink>
          </Paragraph>
        </Section>
        
        <Section>
          <SectionTitle>Features</SectionTitle>
          <List>
            <ListItem>
              <Strong>🍅 Flow Timer:</Strong> 
              <NestedList>
                <ListItem>A simple Pomodoro-style timer to help you stay focused while writing, practicing, or producing.</ListItem>
              </NestedList>
            </ListItem>
            <ListItem>
              <Strong>🎲 Inspiration Generator:</Strong>
              <NestedList>
                <ListItem>Randomize scales, BPM, and sounds. Lock in what you like and shuffle the rest.</ListItem>
              </NestedList>
            </ListItem>
            <ListItem>
              <Strong>🎶 Metronome:</Strong>
              <NestedList>
                <ListItem>Follows the BPM from the Inspiration Generator, with manual adjustment in 1-step increments.</ListItem>
              </NestedList>
            </ListItem>
            <ListItem>
              <Strong>📝 Notes:</Strong>
              <NestedList>
                <ListItem>Write down lyrics, chord progressions, FX pedal settings, etc'...</ListItem>
              </NestedList>
            </ListItem>
            <ListItem>
              <Strong>💾 Save Your Work:</Strong>
              <NestedList>
                <ListItem>Save or load your project as a JSON file to pick up where you left off or share with others.</ListItem>
              </NestedList>
            </ListItem>
            <ListItem>
              <Strong>🌓 Dark / Light Modes:</Strong>
              <NestedList>
                <ListItem>Yes.</ListItem>
              </NestedList>
            </ListItem>
          </List>
        </Section>
        
        <Section>
          <SectionTitle>Technologies Used</SectionTitle>
          <TechList>
            <TechItem>
              <IconContainer><Icon icon={FaReact} size={16} /></IconContainer>
              React
            </TechItem>
            <TechItem>
              <IconContainer>TS</IconContainer>
              TypeScript
            </TechItem>
            <TechItem>
              <IconContainer>🎵</IconContainer>
              Tone.js
            </TechItem>
            <TechItem>
              <IconContainer>🔀</IconContainer>
              Framer Motion
            </TechItem>
            <TechItem>
              <IconContainer><Icon icon={FaNodeJs} size={16} /></IconContainer>
              Node.js
            </TechItem>
            <TechItem>
              <IconContainer><Icon icon={FaIcons} size={16} /></IconContainer>
              React Icons
            </TechItem>
          </TechList>
          <Paragraph style={{ marginTop: '1rem' }}>
            <StyledLink href="https://www.npmjs.com/package/tone" target="_blank" rel="noopener noreferrer">
              Tone.js
            </StyledLink> Audio engine for the metronome.
          </Paragraph>
          <Paragraph>
            <StyledLink href="https://react-icons.github.io/react-icons/" target="_blank" rel="noopener noreferrer">
              React Icons
            </StyledLink> providing Font Awesome, Game Icons and more icon collections.
          </Paragraph>
        </Section>
      </AboutCard>
    </AboutContainer>
  );
};

export default AboutPage;
