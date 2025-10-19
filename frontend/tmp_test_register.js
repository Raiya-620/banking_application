(async () => {
  try {
    const ts = Date.now();
    const email = `testuser+${ts}@example.com`;
    const body = {
      first_name: "Auto",
      last_name: "Tester",
      email,
      password: "Password123",
    };

    let res = await fetch("http://127.0.0.1:8000/api/auth/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    let txt = await res.text();
    console.log("REGISTER STATUS", res.status);
    try {
      console.log(JSON.parse(txt));
    } catch (e) {
      console.log(txt);
    }

    if (res.status >= 200 && res.status < 300) {
      res = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: body.email, password: body.password }),
      });
      txt = await res.text();
      console.log("LOGIN STATUS", res.status);
      try {
        console.log(JSON.parse(txt));
      } catch (e) {
        console.log(txt);
      }
    }
  } catch (e) {
    console.error("ERR", e);
  }
})();
