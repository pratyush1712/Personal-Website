# ✉️ Contact Me

If you have any questions or would like to get in touch, please use one of the methods below and I will get back to you as soon as possible.
<div style="display: flex; justify-content: space-between; margin-top: -20px;">
  <div style="width: 48%;">
    <h2>Contact via Socials</h2>
    <p>Feel free to reach out to me on my social media platforms:</p>
    <ul>
      <li><a href="https://www.linkedin.com/in/pratyushsudhakar/" target="_blank">LinkedIn</a></li>
      <li><a href="https://instagram.com/pratyush.sudhakar" target="_blank">Instagram</a></li>
      <li><a href="https://www.facebook.com/pratyush.sudhakar" target="_blank">Facebook</a></li>
      <li><a href="https://github.com/pratyush1712" target="_blank">GitHub</a></li>
    </ul>
  </div>
  <div style="border-left: 1px solid #ccc; margin: 20px 20px 0px; padding:8px;"></div>
  <div style="width: 48%;">
    <h2>Contact via Form</h2>
    <p>Fill out the form below to send me a message:</p>
    <form id="contactForm" action="/api/contact" method="POST">
      <div style="margin-bottom: 10px;">
        <label for="name" style="display: block; margin-bottom: 5px;">Name:</label>
        <input type="text" id="name" name="name" required style="width: 100%; height: 35px; border-radius:5px; padding: 8px; box-sizing: border-box;">
      </div>
      <div style="margin-bottom: 10px;">
        <label for="email" style="display: block; margin-bottom: 5px;">Email:</label>
        <input type="email" id="email" name="email" required style="width: 100%; height: 35px; border-radius:5px; padding: 8px; box-sizing: border-box;">
      </div>
      <div style="margin-bottom: 10px;">
        <label for="message" style="display: block; margin-bottom: 5px;">Message:</label>
        <textarea id="message" name="message" required style="width: 100%; border-radius:5px; height: 90px; padding: 8px; box-sizing: border-box;"></textarea>
      </div>
      <input name="honeypot" class="visually-hidden" tabindex="-1" autocomplete="off" type="hidden">
      <button type="submit" style="padding: 10px 15px; background-color: #3279CB; color: white; border: none; border-radius:5px; cursor: pointer; width: 100%;">Send</button>
    </form>
  </div>
</div>