const form=document.querySelector("#brief-form");
const topic=document.querySelector("#topic");
const audience=document.querySelector("#audience");
const format=document.querySelector("#format");
const sources=document.querySelector("#sources");
const empty=document.querySelector("#empty-state");
const result=document.querySelector("#result");
const blueprint=document.querySelector("#blueprint");
let currentMarkdown="";
const templates={
 short:["HOOK (0–5s)","Explain the surprising question or misconception in one sentence.","CORE IDEA (5–20s)","Introduce the central idea in plain language. Define one unfamiliar term.","HOW IT WORKS (20–45s)","Walk through the mechanism in two or three simple beats. Suggest one visual analogy.","TAKEAWAY (45–55s)","State the one thing the viewer should remember.","CLOSE (55–60s)","End with a useful question or a reason to save/share."],
 carousel:["SLIDE 1 — THE HOOK","A clear question or counter-intuitive statement.","SLIDE 2 — THE CONTEXT","What the audience needs to know first.","SLIDE 3 — THE CORE IDEA","Explain the main concept in one simple statement.","SLIDE 4 — THE EXAMPLE","Show a concrete example or analogy.","SLIDE 5 — THE TAKEAWAY","Summarise the practical insight.","SLIDE 6 — THE NEXT STEP","Invite a thoughtful question, save, or share."],
 lesson:["OPENING (0–20s)","Set up the question and why it matters.","FOUNDATION (20–60s)","Define terms and establish the basic model.","EXPLANATION (60–130s)","Explain the mechanism step by step, using one example.","CHECK UNDERSTANDING (130–155s)","Ask a question that reveals whether the idea landed.","SUMMARY (155–180s)","Restate the key insight and point to further reading."]
};
function safeText(s){return s.trim()||"Add your own explanation here."}
function makeDraft(){
 const title=topic.value.trim();
 if(!title){topic.focus();return}
 const src=sources.value.split("\n").map(x=>x.trim()).filter(Boolean);
 const beats=templates[format.value];
 const duration=format.value==="short"?"60-second short":format.value==="carousel"?"6-slide carousel":"3-minute mini lesson";
 const lines=[
 "# "+title,
 "",
 "**Audience:** "+audience.value,
 "**Format:** "+duration,
 "",
 "## One-sentence takeaway",
 "Write the single most useful thing the audience should understand about "+title+".",
 "",
 "## Explainer structure",
 ...beats.flatMap((beat,i)=>["### "+beat,"[Draft this beat in plain language for "+audience.value.toLowerCase()+".]","**Visual direction:** Show one concrete object, diagram, comparison, or action that makes this idea visible.",""]),
 "## Publishing caption",
 "Most people hear about "+title+", but what does it actually mean? Here is the simple explanation — and the key idea worth remembering.",
 "",
 "## Source checklist",
 ...(src.length?src.map((s,i)=>(i+1)+". "+s):["- Add at least one trustworthy primary source before publishing."]),
 "",
 "## Final fact-check",
 "- [ ] Every factual claim is supported by a source.",
 "- [ ] Numbers, dates, and quotations are checked against the original.",
 "- [ ] The visual analogy does not distort the underlying idea.",
 "- [ ] The explanation is understandable to the selected audience.",
 "",
 "_Drafting scaffold only. This tool does not fetch, read, or verify the linked sources._"
 ];
 currentMarkdown=lines.join("\n");
 blueprint.textContent=currentMarkdown;
 empty.classList.add("hidden");
 result.classList.remove("hidden");
}
form.addEventListener("submit",e=>{e.preventDefault();makeDraft()});
document.querySelector("#copy-btn").addEventListener("click",async()=>{currentMarkdown=blueprint.innerText;try{await navigator.clipboard.writeText(currentMarkdown);document.querySelector("#copy-btn").textContent="Copied ✓"}catch{document.querySelector("#copy-btn").textContent="Select and copy"}});
document.querySelector("#download-btn").addEventListener("click",()=>{const text=blueprint.innerText;const blob=new Blob([text],{type:"text/markdown;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="melyqon-explainer.md";a.click();URL.revokeObjectURL(url)});
