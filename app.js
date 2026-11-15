const form=document.querySelector("#brief-form");
const topic=document.querySelector("#topic");
const audience=document.querySelector("#audience");
const format=document.querySelector("#format");
const sources=document.querySelector("#sources");
const endpoint=document.querySelector("#api-endpoint");
const statusEl=document.querySelector("#status");
const generateBtn=document.querySelector("#generate-btn");
const empty=document.querySelector("#empty-state");
const result=document.querySelector("#result");
const blueprint=document.querySelector("#blueprint");
let currentMarkdown="";

const structures={
 short:["HOOK (0–5s)","CORE IDEA (5–20s)","HOW IT WORKS (20–45s)","TAKEAWAY (45–55s)","CLOSE (55–60s)"],
 carousel:["SLIDE 1 — THE HOOK","SLIDE 2 — THE CONTEXT","SLIDE 3 — THE CORE IDEA","SLIDE 4 — A CONCRETE EXAMPLE","SLIDE 5 — THE TAKEAWAY","SLIDE 6 — THE NEXT STEP"],
 lesson:["OPENING (0–20s)","FOUNDATION (20–60s)","EXPLANATION (60–130s)","CHECK UNDERSTANDING (130–155s)","SUMMARY (155–180s)"]
};

function buildPrompt(){
 const kind=format.value==="short"?"60-second short":format.value==="carousel"?"6-slide carousel":"3-minute mini lesson";
 return `Create a complete, accurate, engaging explainer for the topic below.

TOPIC: ${topic.value.trim()}
AUDIENCE: ${audience.value}
FORMAT: ${kind}
USER-PROVIDED SOURCE LINKS (references only; you cannot claim to have opened or verified them):
${sources.value.trim()||"None provided"}

Requirements:
- Write the actual finished script. Never output placeholders, instructions to the user, or bracketed drafting prompts.
- Start with a specific one-sentence takeaway.
- Use plain language suitable for the audience; explain jargon the first time.
- Make every beat narratable and concrete. Include timestamps, spoken narration, and a practical visual direction for each beat/slide.
- Explain the mechanism, not just definitions. Use one helpful analogy and state where it is imperfect if needed.
- Distinguish established facts from uncertainty. Do not invent statistics, studies, quotes, dates, or citations.
- If sources are supplied, list them as user-provided, unverified references. If none are supplied, suggest 2–4 trustworthy primary-source organisations or documentation pages to consult, with search phrases; do not fabricate exact URLs.
- End with a concise publishing caption, source checklist, and 3 specific fact-check questions.
- Keep timing realistic for the selected format.
- Output clean Markdown only, with clear headings. Do not claim you fetched or verified sources.`;
}

function showDraft(markdown){
 currentMarkdown=markdown;
 blueprint.textContent=markdown;
 empty.classList.add("hidden");
 result.classList.remove("hidden");
}

function sampleDraft(){
 const title=topic.value.trim();
 const kind=format.value;
 const headings=structures[kind];
 const intro=kind==="short"?"Here is the core idea in plain language:":"Start with the question your audience already has.";
 const lines=[`# ${title}`,"",`**Audience:** ${audience.value}`,`**Format:** ${kind==="short"?"60-second short":kind==="carousel"?"6-slide carousel":"3-minute mini lesson"}`,"","## One-sentence takeaway",`A useful first draft about ${title.toLowerCase()} should explain the central mechanism, not just define the term.`,"","## Explainer structure"];
 headings.forEach((h,i)=>lines.push(`### ${h}`,i===0?intro:"Explain one idea at a time, using a concrete example. Replace this sample text with a researched explanation before publishing.", "**Visual direction:** Use a simple labelled diagram or real-world example that makes this beat visible.",""));
 lines.push("## Publishing caption",`A clear first look at ${title.toLowerCase()}: the central idea, how it works, and what to remember.`,"","## Source checklist","- Add at least one trustworthy primary source.","- Verify each factual claim against the original source.","","## Fact-check questions","- What evidence supports the central mechanism?","- Are there important exceptions or limits?","- Does the visual analogy preserve the science?","","_Sample scaffold only. Connect an AI Worker to generate a complete topic-specific script._");
 return lines.join("\n");
}

form.addEventListener("submit",async e=>{
 e.preventDefault();
 if(!topic.value.trim()){topic.focus();return;}
 const url=endpoint.value.trim();
 if(!url){showDraft(sampleDraft());statusEl.textContent="Sample mode: connect a Cloudflare Worker URL for real AI-generated scripts.";return;}
 generateBtn.disabled=true;
 generateBtn.textContent="Writing your explainer…";
 statusEl.textContent="Generating a researched-style draft. Source links are not fetched or verified.";
 try{
   const response=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({topic:topic.value.trim(),audience:audience.value,format:format.value,sources:sources.value.trim()})});
   const data=await response.json();
   if(!response.ok)throw new Error(data.error||"Generation failed ("+response.status+")");
   if(!data.text)throw new Error("The AI returned an empty response.");
   showDraft(data.text);
   statusEl.textContent="AI draft generated. Check every factual claim and source before publishing.";
 }catch(err){
   statusEl.textContent="Could not generate: "+err.message+". Check the Worker URL and deployment.";
 }finally{
   generateBtn.disabled=false;
   generateBtn.innerHTML='Build my explainer <span aria-hidden="true">↗</span>';
 }
});

document.querySelector("#copy-btn").addEventListener("click",async()=>{
 currentMarkdown=blueprint.innerText;
 try{await navigator.clipboard.writeText(currentMarkdown);document.querySelector("#copy-btn").textContent="Copied ✓";}
 catch{document.querySelector("#copy-btn").textContent="Select and copy";}
});
document.querySelector("#download-btn").addEventListener("click",()=>{
 const blob=new Blob([blueprint.innerText],{type:"text/markdown;charset=utf-8"});
 const url=URL.createObjectURL(blob);
 const a=document.createElement("a");a.href=url;a.download="melyqon-explainer.md";a.click();URL.revokeObjectURL(url);
});
