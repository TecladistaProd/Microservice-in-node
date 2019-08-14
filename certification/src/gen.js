import { readFile as rF, writeFile as wF, unlink as ul } from "fs";
import { promisify } from "util";
import { resolve } from "path";
import phantom from "phantomjs-prebuilt";
import { execFile } from "child_process";

const readFile = promisify(rF),
  writeFile = promisify(wF),
  unlink = promisify(ul);

export default (user, course) =>
  new Promise(async (res, rej) => {
    const fileTemp = await readFile(
      resolve(__dirname, "./templates/index.html")
    );
    let html = fileTemp.toString();

    html = html.replace(/{{name}}/g, user.name);
    html = html.replace(/{{course.name}}/g, course.name);
    html = html.replace(/{{course.startMonth}}/g, course.startMonth);
    html = html.replace(/{{course.endMonth}}/g, course.endMonth);
    html = html.replace(/{{course.totalHours}}/g, course.totalHours);

    // html = html.replace(/href\=\"css/g, 'href="../templates/css');
    let img = await readFile(
      resolve(__dirname, "./templates/images/assign.png")
    );
    html = html.replace(
      /src\=\"images/g,
      `src="data:image/png;base64,${await img.toString("base64")}"`
    );

    // generate
    try {
      let tempFile = resolve(__dirname, `./temp/${user.user_id}.html`);
      await writeFile(tempFile, html);
      let program = phantom.exec(
        "--debug=false",
        "./src/ph.js",
        tempFile,
        resolve(__dirname, `./certificates/${user.user_id}.png`),
        __dirname
      );

      program.stdout.pipe(process.stdout);
      program.stderr.pipe(process.stderr);

      program.on("error", rej);
      program.on("exit", async () => {
        await unlink(tempFile);
        res("ok");
      });
    } catch (err) {
      rej(err);
    }
  });

// generate(
//   {
//     name: "Jonathan Smith",
//     email: "jo_sm@email.com",
//     user_id: "32AA129S"
//     // Math.ceil(Math.random() * Date.now())
//     //   .toString(32)
//     //   .toUpperCase()
//   },
//   {
//     name: "FullStack Dart Developer",
//     startMonth: "12/2018",
//     endMonth: "05/2019",
//     totalHours: "300 Horas"
//   }
// );
