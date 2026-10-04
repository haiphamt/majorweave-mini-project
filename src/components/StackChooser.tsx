import { stacks, type BackendStack } from '../data';

export function StackChooser({ value, onChange }: { value: BackendStack; onChange: (stack: BackendStack) => void }) {
  return <section className="stack-chooser" aria-labelledby="stack-heading">
    <div className="stack-intro"><span className="eyebrow">CHOOSE YOUR TOOLS</span><h2 id="stack-heading">Một hướng. Ba cách bắt đầu.</h2><p>Chọn ngôn ngữ và framework cho kế hoạch thực hành Backend của bạn.</p></div>
    <div className="stack-options">{(Object.keys(stacks) as BackendStack[]).map(id => {
      const stack = stacks[id];
      return <button key={id} type="button" className={`stack-option ${value === id ? 'active' : ''}`} aria-pressed={value === id} onClick={() => { if (id !== value) onChange(id); }}>
        <span className="stack-indicator" aria-hidden="true">{value === id ? '✓' : '○'}</span><strong>{stack.name}</strong><small>{stack.framework} · SQL</small>
      </button>;
    })}</div>
    <p className="stack-caption">Ba nhánh này có nguồn học và kế hoạch riêng. Bạn có thể học ngôn ngữ khác qua roadmap tham khảo.</p>
  </section>;
}
