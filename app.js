// ===== Config =====
const QUOTE_EMAIL = 'orders@letsgeauxcreate.com';
const MAX_FILE_HINT = 'Attach your reference image before sending.'; // mailto cannot auto-attach
const MAX_FILE_MB = 15;
const ACCEPTED_TYPES = ['image/jpeg','image/png','image/webp'];
// ===================

const form = document.getElementById('quoteForm');
const fallback = document.getElementById('fallbackMsg');
const copyLink = document.getElementById('copyTemplate');

const BLANK_TEMPLATE =
`Name: {Your Name}
Email: {you@example.com}
Desired Size: {e.g., 3×5 ft}
Shape: {Freeform/Circle/Rectangle/Square/Other}
Budget: {$100–$200 / $200–$400 / $400–$700 / $700+}

Notes / Concept:
- Colors:
- Timeline:
- Other details:

(Attach your reference image to this email.)`;

function setFallback(text) {
  if (!fallback) return;
  fallback.classList.remove('hidden');
  fallback.textContent = text;
}

function runTests() {
  const results = [];
  results.push(['Quote form exists', !!form]);
  const name = form?.querySelector('input[name="name"]');
  const email = form?.querySelector('input[name="email"]');
  results.push(['Name required', name?.hasAttribute('required')]);
  results.push(['Email required', email?.hasAttribute('required')]);
  console.table(results.map(([k,v]) => ({ test: k, pass: !!v })));
  return results.every(([,v]) => !!v);
}

if (copyLink) {
  copyLink.addEventListener('click', (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(BLANK_TEMPLATE)
      .then(() => setFallback('Blank email template copied. Paste it into your email.'))
      .catch(() => setFallback('Could not copy. Long-press or select and copy manually.'));
  });
}

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(form);

  // Honeypot
  if ((fd.get('company') || '').toString().trim() !== '') return;

  // Required
  const name  = (fd.get('name')  || '').toString().trim();
  const email = (fd.get('email') || '').toString().trim();
  if (!name || !email) {
    setFallback('Please add your name and email.');
    return;
  }

  // Optional fields
  const size   = (fd.get('size')   || '').toString().trim();
  const shape  = (fd.get('shape')  || '').toString().trim();
  const budget = (fd.get('budget') || '').toString().trim();
  const notes  = (fd.get('notes')  || '').toString().trim();

  // Optional file (cannot auto-attach; we only validate/lightly hint)
  const file = document.getElementById('reference')?.files?.[0];
  if (file) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFallback('Please upload a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setFallback(`Image is too large. Max ${MAX_FILE_MB} MB.`);
      return;
    }
  }

  // Prefilled subject/body for mailto
  const subject = encodeURIComponent(`Custom Rug Quote — ${name}`);
  const body = encodeURIComponent(
`Name: ${name}
Email: ${email}
Desired Size: ${size}
Shape: ${shape}
Budget: ${budget}

Notes / Concept:
${notes}

(${MAX_FILE_HINT})
`
  );

  // Open default mail client
  window.location.href = `mailto:${QUOTE_EMAIL}?subject=${subject}&body=${body}`;

  // Accessible hint
  setFallback('Your email app should open. If not, email orders@letsgeauxcreate.com and paste the template. Don’t forget to attach your image.');
});

document.addEventListener('DOMContentLoaded', runTests);
