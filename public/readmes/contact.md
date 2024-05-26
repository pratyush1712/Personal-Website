# ✉️ Contact Me

If you have any questions or would like to get in touch, please fill out the form below and I will get back to you as soon as possible.

<form id="contactForm" action="/api/contact" method="POST">
  <div style="margin-bottom: 15px;">
    <label for="name" style="display: block; margin-bottom: 5px;">Name:</label>
    <input type="text" id="name" name="name" required style="width: 100%; height: 35px; padding: 8px; box-sizing: border-box;">
  </div>
  <div style="margin-bottom: 15px;">
    <label for="email" style="display: block; margin-bottom: 5px;">Email:</label>
    <input type="email" id="email" name="email" required style="width: 100%; height: 35px; padding: 8px; box-sizing: border-box;">
  </div>
  <div style="margin-bottom: 15px;">
    <label for="message" style="display: block; margin-bottom: 5px;">Message:</label>
    <textarea id="message" name="message" required style="width: 100%; height: 100px; padding: 8px; box-sizing: border-box;"></textarea>
  </div>
  <button type="submit" style="padding: 10px 15px; background-color: #3279CB; color: white; border: none; cursor: pointer; width: 100%;">Send</button>
</form>

<script>
document.getElementById('contactForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  
  fetch(form.action, {
    method: form.method,
    body: formData
  })
  .then(response => {
    if (response.ok) {
      alert('Success! Your message has been sent.');
      form.reset();
    } else {
      alert('Oops! There was a problem with your submission. Please try again.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Oops! There was a problem with your submission. Please try again.');
  });
});
</script>
