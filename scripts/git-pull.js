import { execSync } from "child_process"

const run = (cmd) => {
  try {
    const out = execSync(cmd, { cwd: "/vercel/share/v0-project", encoding: "utf8" })
    console.log(out)
  } catch (e) {
    console.error(e.message)
  }
}

run("git fetch origin")
run("git pull origin main --rebase")
run("git log --oneline -5")
