#!/usr/bin/env node
const argv = require('yargs-parser')(process.argv.slice(2));
const fs  =require("fs");
const path =require("path");
const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const shell = require("shelljs");

const outputVersion = (versionStr) => {
    console.log(
        chalk.green(
            figlet.textSync(versionStr, {
                font: "Train",
                horizontalLayout: "default",
                verticalLayout: "default"
            })
        )
    );
};
const outputHelp= () => {
    console.log('\nUsage: caf <command>| [options]');
    console.log(`\nOptions:
    -v, --version                  output the version number
    -h, --help                     output usage information`)
    console.log(`\nCommands:
    touch                          Create a file under the src folder
    `)
}
const outputOther=()=>{
    console.log('\nRun caf <command> --help for detailed usage of given command.\n');
}

const askQuestions = () => {
    const questions = [
        {
            name: "FILENAME",
            type: "input",
            message: "What is the name of the file without extension?"
        },
        {
            type: "list",
            name: "EXTENSION",
            message: "What is the file extension?",
            choices: [".html",".css", ".js",".json",".vue",".jsx"],
            filter: function (val) {
                return val.split(".")[1];
            }
        },
        {
            type: "confirm",
            name: "ISCONTENT",
            message: "Whether to write content to the file?",
        },
    ];
    return inquirer.prompt(questions);
};

const wirteFileQuestions=()=>{
    const question=[
        {
            type: "editor",
            name: "CONTENT",
            message: "Write content:",
        }
    ]
    return inquirer.prompt(question);
}

const createFile = (filename, extension) => {
    const file = `${filename}.${extension}`
    shell.cd("./src");
    shell.touch(file);
    // shell.exec()  通过该方法，直接执行shell命令，dosomething
    return file;
};

const success = (filename) => {
    console.log(
        chalk.white.bgGreen.bold(`OK! File Created ${filename}`)
    );
    shell.exit(1);
};

const run = async (argv) => {
   
    if (argv.v === true || argv.version === true) {
        // 版本信息
        outputVersion("caf 0.0.1");
        return true;
	} else if (argv.h === true || argv.help === true) {
        //帮助信息
        outputHelp()
        return true;
	}else if(argv._.indexOf("touch")!=-1){
        // 询问问题
        const answers = await askQuestions();   
        let {
            FILENAME,
            EXTENSION,
            ISCONTENT
        } = answers;
        //创建文件
        const file = createFile(FILENAME, EXTENSION);
        if(ISCONTENT){
            const wfqAnswers = await wirteFileQuestions();
            if(wfqAnswers.CONTENT!=""){
                let {CONTENT}=wfqAnswers
                let url=path.resolve(__dirname,"../src",`${file}`)   
                fs.writeFileSync(`${url}`,`${CONTENT}`);
            } 
        }
        // 展示信息
        success(file);
        return true;
    }else{
        //其他信息
        outputOther();
    }
};
run(argv);