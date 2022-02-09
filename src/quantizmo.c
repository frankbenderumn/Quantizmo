#ifdef DEBUGF
#define DEBUG 1
#else
#define DEBUG 0
#endif

#if defined(_WIN32)
#ifndef _WIN32_WINNT
#define _WIN32_WINNT 0x0600
#endif
#include <winsock2.h>
#include <ws2tcpip.h>
#pragma comment(lib, "ws2_32.lib")

#else
#include <sys/type.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <netdb.h>
#include <unistd.h>
#include <errno.h>
#endif 

#include <stdio.h>
#include "color.h"


int main() {
    // printf("Okay, let's get started.\n");

    if(DEBUG) { 
        cyan(); printf("\rDebugger is active\n"); clearcolor(); 
        red(); printf("\rDoes this work\n"); clearcolor();
    }

    return 0;
}