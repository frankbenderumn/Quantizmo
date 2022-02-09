CC=gcc
BUILDDIR=build
SRCDIR=src
INCLUDES=-Iinclude -I. 
LIBS=-L.

$(BUILDDIR)/%.o: $(SRCDIR)/%.c
	$(CC) $(INCLUDES) -c -o $@ $<

dir: 
	mkdir -p build

quantizmo: $(BUILDDIR)/quantizmo.o
	$(CC) $(INCLUDES) -o $@ $^

debug: CC += -DDEBUGF -g
debug: dir quantizmo

all: dir quantizmo


.PHONY: clean

clean:
	rm -f *.o
	rm -f quantizmo
	rm -f log.txt