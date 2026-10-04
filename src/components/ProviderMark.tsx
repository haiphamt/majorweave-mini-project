

const providerColors: Record<string, string> = { 'F8': 'rust', 'freeCodeCamp': 'ink', 'W3Schools': 'green', 'MDN': 'ink', 'Node.js': 'green', 'The Odin Project': 'ochre', 'University of Helsinki': 'blue', 'MongoDB': 'green', 'Git': 'rust', 'PostgreSQL': 'blue', 'AWS': 'ochre', 'Docker': 'blue', 'PortSwigger': 'rust', 'Boot.dev': 'blue', 'Exercism': 'ochre' };
export function ProviderMark({ name }: { name: string }) { return <span className={`provider-mark ${providerColors[name] || 'ink'}`} aria-hidden="true">{name === 'freeCodeCamp' ? '</>' : name === 'University of Helsinki' ? 'UH' : name === 'The Odin Project' ? 'O' : name === 'W3Schools' ? 'W3' : name.slice(0, 2)}</span>; }
