const defaultJobs = [
  {id:1,title:"Junior Java Developer",company:"TechNova",location:"Noida, India",type:"Full-time",experience:"Fresher",mode:"Hybrid",category:"Software",salary:"₹4-6 LPA",days:1,description:"Build and maintain backend services, write clean Java code and work with a collaborative engineering team.",skills:["Java","OOP","SQL","Spring Boot"]},
  {id:2,title:"Frontend Developer Intern",company:"PixelCraft",location:"Remote",type:"Internship",experience:"Fresher",mode:"Remote",category:"Software",salary:"₹15-25K / month",days:2,description:"Create responsive interfaces and reusable components using modern frontend technologies.",skills:["HTML","CSS","JavaScript","Git"]},
  {id:3,title:"Data Analyst",company:"InsightWorks",location:"Gurugram, India",type:"Full-time",experience:"0-2 years",mode:"Hybrid",category:"Data",salary:"₹5-8 LPA",days:3,description:"Turn business data into useful insights, dashboards and reports for decision makers.",skills:["Excel","SQL","Python","Power BI"]},
  {id:4,title:"UI/UX Designer",company:"CreativeLabs",location:"Bengaluru, India",type:"Full-time",experience:"0-2 years",mode:"On-site",category:"Design",salary:"₹5-7 LPA",days:4,description:"Design intuitive product experiences from wireframes to polished high-fidelity screens.",skills:["Figma","Wireframes","Prototyping"]},
  {id:5,title:"JavaScript Developer",company:"CodeSphere",location:"Remote",type:"Full-time",experience:"0-2 years",mode:"Remote",category:"Software",salary:"₹6-10 LPA",days:5,description:"Develop interactive web applications and improve product performance with JavaScript.",skills:["JavaScript","DOM","APIs","GitHub"]},
  {id:6,title:"Digital Marketing Executive",company:"MarketMint",location:"Delhi, India",type:"Full-time",experience:"Fresher",mode:"On-site",category:"Marketing",salary:"₹3-5 LPA",days:6,description:"Support campaigns, content, SEO and analytics across digital marketing channels.",skills:["SEO","Analytics","Content"]},
  {id:7,title:"Python Developer Intern",company:"DataForge",location:"Pune, India",type:"Internship",experience:"Fresher",mode:"Hybrid",category:"Software",salary:"₹18-30K / month",days:7,description:"Work on Python automation and backend tasks while learning production engineering practices.",skills:["Python","Django","SQL"]},
  {id:8,title:"Business Data Intern",company:"GrowthGrid",location:"Remote",type:"Internship",experience:"Fresher",mode:"Remote",category:"Data",salary:"₹12-20K / month",days:8,description:"Assist with data cleaning, reporting and basic analysis for growth teams.",skills:["Excel","SQL","Data Analysis"]}
];

let jobs = JSON.parse(localStorage.getItem("jobhub_jobs")) || defaultJobs;
let saved = JSON.parse(localStorage.getItem("jobhub_saved")) || [];
let currentJob = null;
let activeCategory = "All";

const $ = id => document.getElementById(id);
const jobList = $("jobList");

function saveState(){
  localStorage.setItem("jobhub_jobs", JSON.stringify(jobs));
  localStorage.setItem("jobhub_saved", JSON.stringify(saved));
}

function initials(name){ return name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase(); }

function showToast(message){
  const t=$("toast"); t.textContent=message; t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2200);
}

function renderStats(){
  $("totalJobs").textContent=jobs.length;
  $("remoteJobs").textContent=jobs.filter(j=>j.mode==="Remote").length;
  $("companyCount").textContent=new Set(jobs.map(j=>j.company)).size;
  $("savedCount").textContent=saved.length;
}

function getFilteredJobs(){
  const q=$("searchInput").value.trim().toLowerCase();
  const loc=$("locationInput").value.trim().toLowerCase();
  const type=$("typeFilter").value, exp=$("experienceFilter").value, mode=$("modeFilter").value;
  let result=jobs.filter(j=>{
    const text=[j.title,j.company,j.category,...j.skills].join(" ").toLowerCase();
    return (!q || text.includes(q))
      && (!loc || j.location.toLowerCase().includes(loc))
      && (activeCategory==="All" || j.category===activeCategory)
      && (type==="All" || j.type===type)
      && (exp==="All" || j.experience===exp)
      && (mode==="All" || j.mode===mode);
  });
  const sort=$("sortSelect").value;
  if(sort==="salaryHigh") result.sort((a,b)=>salaryValue(b.salary)-salaryValue(a.salary));
  if(sort==="company") result.sort((a,b)=>a.company.localeCompare(b.company));
  if(sort==="latest") result.sort((a,b)=>a.days-b.days);
  return result;
}

function salaryValue(s){
  const nums=s.match(/\d+/g);
  return nums ? Number(nums[nums.length-1]) : 0;
}

function renderJobs(){
  const result=getFilteredJobs();
  $("resultText").textContent=`Showing ${result.length} job${result.length!==1?"s":""}`;
  $("emptyState").classList.toggle("hidden",result.length>0);
  jobList.innerHTML=result.map(j=>`
    <article class="job-card">
      <div class="job-main">
        <div class="company-logo">${initials(j.company)}</div>
        <div>
          <h3>${escapeHTML(j.title)}</h3>
          <div class="company">${escapeHTML(j.company)} • ${escapeHTML(j.location)}</div>
          <div class="meta">
            <span class="tag">${j.type}</span><span class="tag">${j.mode}</span>
            <span class="tag">${j.experience}</span><span class="tag">${j.category}</span>
            <span class="salary">${j.salary}</span>
          </div>
        </div>
      </div>
      <div class="card-actions">
        <button class="icon-btn ${saved.includes(j.id)?"saved":""}" title="Save job" onclick="toggleSave(${j.id})">${saved.includes(j.id)?"♥":"♡"}</button>
        <button class="view-btn" onclick="openJob(${j.id})">View job</button>
      </div>
    </article>
  `).join("");
  renderStats();
}

function escapeHTML(str){
  return String(str).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}

function toggleSave(id){
  saved=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];
  saveState(); renderJobs();
  showToast(saved.includes(id)?"Job saved":"Job removed from saved");
}

function openJob(id){
  currentJob=jobs.find(j=>j.id===id);
  if(!currentJob)return;
  $("modalContent").innerHTML=`
    <p class="eyebrow">${currentJob.category.toUpperCase()}</p>
    <h2>${escapeHTML(currentJob.title)}</h2>
    <div class="company">${escapeHTML(currentJob.company)} • ${escapeHTML(currentJob.location)}</div>
    <div class="detail-meta">
      <span class="tag">${currentJob.type}</span><span class="tag">${currentJob.mode}</span>
      <span class="tag">${currentJob.experience}</span><span class="tag">${currentJob.salary}</span>
    </div>
    <div class="detail-section"><strong>About the role</strong><p>${escapeHTML(currentJob.description)}</p></div>
    <div class="detail-section"><strong>Skills</strong><p>${currentJob.skills.map(s=>`<span class="tag">${escapeHTML(s)}</span> `).join("")}</p></div>
    <button class="primary full" onclick="startApplication()">Apply Now</button>
  `;
  $("jobModal").classList.remove("hidden");
}

function startApplication(){
  $("jobModal").classList.add("hidden");
  $("applyJobTitle").textContent=currentJob.title;
  $("applyModal").classList.remove("hidden");
}

document.querySelectorAll("[data-close]").forEach(btn=>{
  btn.addEventListener("click",()=>$(btn.dataset.close).classList.add("hidden"));
});

document.querySelectorAll(".chip").forEach(chip=>{
  chip.addEventListener("click",()=>{
    document.querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));
    chip.classList.add("active");
    activeCategory=chip.dataset.category;
    renderJobs();
  });
});

["searchInput","locationInput","typeFilter","experienceFilter","modeFilter","sortSelect"].forEach(id=>{
  $(id).addEventListener("input",renderJobs);
  $(id).addEventListener("change",renderJobs);
});
$("searchBtn").addEventListener("click",renderJobs);
$("clearFilters").addEventListener("click",()=>{
  $("searchInput").value=""; $("locationInput").value="";
  $("typeFilter").value="All"; $("experienceFilter").value="All"; $("modeFilter").value="All";
  activeCategory="All";
  document.querySelectorAll(".chip").forEach(c=>c.classList.toggle("active",c.dataset.category==="All"));
  renderJobs();
});

$("applyForm").addEventListener("submit",e=>{
  e.preventDefault();
  const applications=JSON.parse(localStorage.getItem("jobhub_applications")||"[]");
  applications.push({
    jobId:currentJob.id, job:currentJob.title,
    name:$("applicantName").value, email:$("applicantEmail").value,
    phone:$("applicantPhone").value, resume:$("resumeLink").value,
    cover:$("coverLetter").value, appliedAt:new Date().toISOString()
  });
  localStorage.setItem("jobhub_applications",JSON.stringify(applications));
  e.target.reset(); $("applyModal").classList.add("hidden");
  showToast("Application submitted successfully!");
});

$("postJobBtn").addEventListener("click",()=>$("postModal").classList.remove("hidden"));

$("postForm").addEventListener("submit",e=>{
  e.preventDefault();
  const newJob={
    id:Date.now(), title:$("newTitle").value, company:$("newCompany").value,
    location:$("newLocation").value, type:$("newType").value, mode:$("newMode").value,
    experience:"Fresher", category:"Software", salary:$("newSalary").value||"Salary not disclosed",
    days:0, description:"Newly posted opportunity. Contact the company for complete details.",
    skills:["Communication","Teamwork"]
  };
  jobs.unshift(newJob); saveState(); e.target.reset(); $("postModal").classList.add("hidden");
  renderJobs(); showToast("Job published!");
});

window.toggleSave=toggleSave; window.openJob=openJob; window.startApplication=startApplication;
renderJobs();
