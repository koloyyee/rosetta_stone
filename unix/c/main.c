/**
 * A unix command line tiny project to learn a programming language.
 */
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>

/**
 * Simulating `cat` command that read and print the content of a file.
 * free required for after using this function.
 */
char *cwd(void)
{
	char *ptr = NULL;
	long size = pathconf(".", _PC_PATH_MAX);
	char *buf = NULL;

	if ((buf = malloc((size_t)size)) != NULL)
	{

		ptr = getcwd(buf, (size_t)size);
	}
	return ptr;
}

void cat(char *filename)
{

	char *curr_dir = cwd();
	char *dir = strcat(curr_dir, "/");
	char *filepath = strcat(dir, filename);
	FILE *fp = fp = fopen(filepath, "r");

	char *line;
	size_t len;
	ssize_t read;

	if (fp == NULL)
	{
		printf("%s - doesn't exist.", filename);
		return;
	}

	while ((read = getline(&line, &len, fp)) != -1)
	{
		printf("%s\n", line);
	}

	// freeing the memory from cwd() *buf
	if (curr_dir != NULL)
	{
		free(curr_dir);
	}

	fclose(fp);
}

int main(int argc, char *argv[])
{
	// printf("argc: %d\n", argc);
	// printf("[0]: %s\n", argv[0]);
	// printf("[1]: %s\n", argv[1]);
	// printf("[2]: %s\n", argv[2]);
	char *filename = argv[1];
	cat(filename);
	return 0;
}
