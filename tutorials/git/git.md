# Git Tutorial (2017)

*This is a basic guide to using git for file history and version control in this project. If you really want to make the most of this powerful tool I recommend reading and working through the "Pro Git" book by Scott Chacon and Ben Straub, particularly chapters 1, 2, and 3. It is available online at https://git-scm.com/book/en/v2.*

## Introduction

Git is a version control system (VCS) used for tracking and coordinating changes in computer files, and is particularly useful for work involving multiple people. For this Imperial Visualizations project we will be using GitHub - a web based version control repository (repo) and internet hosting service.

## Getting Started

1. Create a GitHub account https://github.com/. You can also use your student email address to activate the Student Develop Pack https://education.github.com/pack which comes with a multitude of software development tools and perks such as private repos (lasts a limited time).

2. Contact Caroline Clewley with your GitHub username/email to be added to the Imperial-Visualizations repo.

3. The owner of the repo can add collaborators by going to Repositories -> Imperial-Visualizations -> Settings -> Collaborators -> (scroll to bottom) Search by username, full name, or email address.

4. Work through the GitHub "Hello World" guide available at https://guides.github.com/activities/hello-world/ to get to grips with the basics. 

5. Have a look at the other guides are available at https://guides.github.com/ (not essential).  

## GitKraken

GitKraken is a GUI (Graphic User Interface) git client that greatly speeds up the process of starting to using git for project collaboration. It is recommended that unless you have used git before you do not use the CLI (Command Line Interface) as this will require substantial effort in self-learning and if used incorrectly may cause issues within the repo.

1. Download GitKraken https://www.gitkraken.com/ and log in with your GitHub account.

2. Clone the Imperial-Visualizations repo by going to File -> Clone Repo -> Clone -> GitHub.com -> *owner username*/Imperial-Visualizations. Select a folder to clone to and press "Clone the repo!" (in this example I used a "UROP/Imperial Visualizations" folder which now contains a "GitHub-Tutorial" folder - the repo.)

### The Basics - Committing, Pushing, and Pulling 

Now that you have access to the repo you can make changes.

1. Any changes made within the local repo folder will be recognised by GitKraken as a change. Changes will in appear the top row of GitKraken appear as //WIP (Work in Progress) and file changes will be defined as green (added), yellow (edited), red (deleted), or blue (moved). In this example a file has been added.

   --folder changes--

2. **Committing:** Now that changes have been made we can now commit (save) the change as part of the development workflow. First select the files you want to commit the changes to and stage them (or use "Stage all changes" to do this for all changed files). In this example there are no changes to discard (careful since this reverts all changes since the last commit!), but this can be done by right clicking on files individually or clicking "Discard all changes" to do this for all files. 

   --staging file and committing (highlight discard options)--

   Now add a useful commit message so that others can see what changes have been made and a description of the commit. You can now commit the change which appears as a new node in the directed acrylic graph.
   
   --adding commit message and pushing--
   
   Using commits means that our work at that stage is saved as part of the development workflow. This allows us to revert back to that repo (and hence file state) if anything goes wrong. To do this right click on the node, go to "reset *branch* to this commit" and choose how strongly to revert changes. In this case we are working on the master branch (more on branches later). 
   
   --revert changes to a commit--
   
3. **Pushing:** Although the changes have been committed they have not been pushed online, so other collaborators accessing the repo cannot see them. This is the difference between local and remote files (covered in the next section). In order for other collaborators to see our changes you must push them. 

   --pushing--

   Note: You can do multiple commits before pushing. This is especially useful for squashing fairly insignificant commits together before pushing online.
   
   --renaming a file twice (2 commits) then squashing before pushing--

4. **Pulling:** If another collaborator pushes changes they will appear as remote changes. In this example imagine the changes made online on GitHub are by another collaborator.

   --make some changes--

   In order to get these changes we must pull them to our local files using "Pull". 
   
   --pull the changes--
   
   If both collaborators work at the same time and collaborator 1 pushes commits while collaborator 2 is still working, git recognises that the local files of collaborator 2 are no longer in sync with the remote files. If collaborator 2 then attempts to push some commits, GitHub automatically merges the remote and local files before applying the changes. 
   
   --merge remote--
   
   This can look quite ugly on the directed acrylic graph so to solve this make sure to pull before making any commits. This ensures the local and remote files are synced and GitKraken automatically stashes and pops any WIP to avoid losing any work (more on stashing and popping later).

   --fix merge remote & auto stash and pop--
   
*LIFE TIP:* PULL BEFORE YOU COMMIT, COMMIT BEFORE YOU PUSH.

### Local and Remote Files

Since we've talked a lot about local and remote files it would be good at this point to explain exactly what they are. It's fairy straightforwards - local files are a copy of the GitHub repo on your computer, and any changes made within this folder are recognised as changes by git. Only you can see the changes made here until they've been committed and pushed.

The remote files are online in the GitHub repo and any pushed commits will affect these files. This is main repo that everyone is working together on and changes made by other collaborators are pulled to local from here.

### Branches

Branches are a very powerful tool for software development but can be quite tricky to get to grips with. Here we will cover the basics but anyone to looking gain a better understanding should refer to chapter 3 of the "Pro Git" book mentioned at the start of this tutorial.

1. Starting a Branch

-- starting branch--

2. Branch Navigation

--local/remote and folders--

3. Switching Branches

--double click - stashing and popping--

### Stashing and Popping

for switching branches. Appear in graph but local only.

--attempt to switch, then stash and switch--

Note: any stashes will appear on the left under stash

--show stash list--

### Merging and Pull Requests

1. Merging branches

--right click and merge--

2. Resolving Merge Conflicts

--mark some as resolved--

3. Pull Requests (Discussion Driven - Dev and Master)

--show and pull request--

### Workflow

Our current workflow is...long-running branches with topic branches.

--image--

If everyone is comfortable with git an update might be to create a main branch for each subgroup to and then for each visualization project make a new branch which will be merged to main subgroup branch when done. Cleaner workflow but everyone needs to be comfortable with branching. Current project is fairly collaborative especially beteween and within subgroups.

Ideas for the future might be to fork to a new repo for each subgroup and then merge to a subgroup branch in the main repo via pull request. Each subgroup can then use a branching workflow for new features as they please without the repo being spammed by other groups. Current project relies heavily on file sharing so subgroups need to see each others branches.

_________________________________________________________________________________________________

Thanks for reading this far! Please direct any further suggestions and questions to Anthony Li (@anthony_li) on the Imperial-Visualizations Slack.