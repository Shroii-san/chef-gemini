import ReactMarkdown from "react-markdown";

export default function Recipe(props) {
  return (
    <section ref={props.ref}>
      <h2>Chef Gemini Merekomendasikan : </h2>
      <article className="suggested-recipe-container" aria-live="polite">
        <ReactMarkdown>{props.recipe}</ReactMarkdown>
      </article>
    </section>
  );
}
